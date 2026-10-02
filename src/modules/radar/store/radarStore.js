import { defineStore } from 'pinia';
import {
  radarService,
  COLOMBIA_LOCATIONS,
  COLOMBIA_AREAS,
  MOCK_COLOMBIAN_USERS
} from '../services/radarService';
import { CURRENT_USER } from '@/shared/data/initialData';

export const useRadarStore = defineStore('radar', {
  state: () => ({
    currentUser: CURRENT_USER,
    users: [...MOCK_COLOMBIAN_USERS],
    activeTab: 'friends', // 'friends' | 'requests' | 'suggestions'
    searchQuery: '',
    selectedDepartment: '',
    selectedCity: '',
    selectedArea: '',
    isLoading: false,
  }),

  getters: {
    departmentsList: () => COLOMBIA_LOCATIONS.map((loc) => loc.department),

    availableCities: (state) => {
      if (!state.selectedDepartment) return [];
      const found = COLOMBIA_LOCATIONS.find((loc) => loc.department === state.selectedDepartment);
      return found ? found.cities : [];
    },

    areasList: () => COLOMBIA_AREAS,

    friendsList: (state) => {
      return state.users.filter((u) => u.status === 'friend');
    },

    requestsList: (state) => {
      return state.users.filter((u) => u.status === 'request_received');
    },

    suggestionsList: (state) => {
      return state.users.filter((u) => u.status === 'suggestion' || u.status === 'request_sent');
    },

    pendingRequestsCount: (state) => {
      return state.users.filter((u) => u.status === 'request_received').length;
    },

    hasActiveFilters: (state) => {
      return Boolean(state.searchQuery || state.selectedDepartment || state.selectedCity || state.selectedArea);
    },

    // Filtered items based on activeTab and filters
    filteredUsers: (state) => {
      let baseList = [];
      if (state.activeTab === 'friends') {
        baseList = state.users.filter((u) => u.status === 'friend');
      } else if (state.activeTab === 'requests') {
        baseList = state.users.filter((u) => u.status === 'request_received');
      } else if (state.activeTab === 'suggestions') {
        baseList = state.users.filter((u) => u.status === 'suggestion' || u.status === 'request_sent');
      }

      return baseList.filter((user) => {
        // Search query
        if (state.searchQuery.trim()) {
          const q = state.searchQuery.toLowerCase().trim();
          const matchName = user.name.toLowerCase().includes(q);
          const matchUsername = user.username.toLowerCase().includes(q);
          const matchBio = user.bio && user.bio.toLowerCase().includes(q);
          const matchCity = user.city && user.city.toLowerCase().includes(q);
          if (!matchName && !matchUsername && !matchBio && !matchCity) return false;
        }

        // Department
        if (state.selectedDepartment && user.department !== state.selectedDepartment) {
          return false;
        }

        // City / Municipio
        if (state.selectedCity && user.city !== state.selectedCity) {
          return false;
        }

        // Area / Interest
        if (state.selectedArea && user.area !== state.selectedArea) {
          return false;
        }

        return true;
      });
    },
  },

  actions: {
    async loadUsers() {
      if (this.users.length > 0) return;
      this.isLoading = true;
      try {
        const data = await radarService.fetchUsers();
        this.users = data;
      } finally {
        this.isLoading = false;
      }
    },

    setActiveTab(tabName) {
      this.activeTab = tabName;
    },

    setSearch(query) {
      this.searchQuery = query;
    },

    setDepartment(department) {
      this.selectedDepartment = department;
      this.selectedCity = ''; // Reset city when department changes
    },

    setCity(city) {
      this.selectedCity = city;
    },

    setArea(area) {
      this.selectedArea = area;
    },

    resetFilters() {
      this.searchQuery = '';
      this.selectedDepartment = '';
      this.selectedCity = '';
      this.selectedArea = '';
    },

    acceptRequest(userId) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.status = 'friend';
      }
    },

    declineRequest(userId) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.status = 'suggestion';
      }
    },

    sendRequest(userId) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.status = 'request_sent';
      }
    },

    cancelRequest(userId) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.status = 'suggestion';
      }
    },

    removeFriend(userId) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.status = 'suggestion';
      }
    },
  },
});
