import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { INITIAL_USERS } from '@/shared/data/initialData';
import { useEventBus, EVENTS } from '@/shared/composables/useEventBus';

export const useRadarStore = defineStore('social.radar', () => {
  const eventBus = useEventBus();

  // State
  const friends = ref(INITIAL_USERS.slice(1, 5));
  const friendRequests = ref([
    {
      id: 'req_1',
      name: 'María Paula Gómez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      mutualFriends: 8,
      location: 'Bogotá, D.C.',
      materials: ['PET', 'Vidrio'],
      timestamp: 'Hace 2 horas',
    },
    {
      id: 'req_2',
      name: 'David Alejandro Pérez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      mutualFriends: 12,
      location: 'Medellín, Antioquia',
      materials: ['Cartón', 'RAEE'],
      timestamp: 'Hace 5 horas',
    },
  ]);

  const suggestions = ref(INITIAL_USERS.slice(5));
  const searchQuery = ref('');
  const selectedDepartment = ref('');
  const selectedMunicipality = ref('');
  const isRadarScanning = ref(false);
  const isLoading = ref(false);
  const errorMsg = ref(null);

  // Computeds
  const filteredFriends = computed(() => {
    let list = friends.value;
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.city && f.city.toLowerCase().includes(q))
      );
    }
    return list;
  });

  const filteredSuggestions = computed(() => {
    let list = suggestions.value;
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.city && s.city.toLowerCase().includes(q))
      );
    }
    return list;
  });

  // Async helper
  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err?.message || 'Error inesperado';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Methods
  const acceptRequest = (reqId) => {
    const idx = friendRequests.value.findIndex((r) => r.id === reqId);
    if (idx !== -1) {
      const req = friendRequests.value[idx];
      friendRequests.value.splice(idx, 1);
      friends.value.unshift({
        id: req.id,
        name: req.name,
        avatar: req.avatar,
        city: req.location,
        mutualFriends: req.mutualFriends,
        isFriend: true,
      });
      eventBus.emit(EVENTS.DATA_REFRESH_NEEDED, { type: 'friends' });
    }
  };

  const rejectRequest = (reqId) => {
    friendRequests.value = friendRequests.value.filter((r) => r.id !== reqId);
  };

  const sendFriendRequest = (user) => {
    suggestions.value = suggestions.value.filter((s) => s.id !== user.id);
  };

  const setSearchQuery = (q) => {
    searchQuery.value = q;
  };

  const setDepartment = (dept) => {
    selectedDepartment.value = dept;
  };

  const setMunicipality = (muni) => {
    selectedMunicipality.value = muni;
  };

  const startRadarScan = () => {
    isRadarScanning.value = true;
    setTimeout(() => {
      isRadarScanning.value = false;
    }, 2000);
  };

  return {
    friends,
    friendRequests,
    suggestions,
    searchQuery,
    selectedDepartment,
    selectedMunicipality,
    isRadarScanning,
    isLoading,
    errorMsg,
    filteredFriends,
    filteredSuggestions,
    executeAsync,
    acceptRequest,
    rejectRequest,
    sendFriendRequest,
    setSearchQuery,
    setDepartment,
    setMunicipality,
    startRadarScan,
  };
});
