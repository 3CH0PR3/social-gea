import { defineStore } from 'pinia';
import { radarService } from '../services/radarService';
import { CURRENT_USER } from '@/shared/data/initialData';

export const useRadarStore = defineStore('radar', {
  state: () => ({
    currentUser: CURRENT_USER,
    nearbyUsers: [],
    friendRequests: [],
    acceptedRequests: [],
    radarRange: 2000,
    selectedUser: null,
    activeTab: 'radar', // 'radar' | 'requests' | 'suggestions'
    isLoading: false,
  }),

  actions: {
    async loadRadarData() {
      if (this.nearbyUsers.length > 0) return;
      this.isLoading = true;
      try {
        const [users, requests] = await Promise.all([
          radarService.fetchNearbyUsers(this.radarRange),
          radarService.fetchFriendRequests(),
        ]);
        this.nearbyUsers = users;
        this.friendRequests = requests;
      } finally {
        this.isLoading = false;
      }
    },

    setRadarRange(meters) {
      this.radarRange = meters;
    },

    selectUser(user) {
      this.selectedUser = user;
    },

    acceptRequest(reqId) {
      if (!this.acceptedRequests.includes(reqId)) {
        this.acceptedRequests.push(reqId);
      }
    },

    declineRequest(reqId) {
      this.friendRequests = this.friendRequests.filter((r) => r.id !== reqId);
    },

    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
  },
});
