import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { CURRENT_USER, INITIAL_USERS } from '@/shared/data/initialData';
import { useEventBus, EVENTS } from '@/shared/composables/useEventBus';

const COLOMBIAN_CITIES_BY_DEPT = {
  'Bogotá D.C.': ['Bogotá D.C.', 'Usaquén', 'Chapinero', 'Suba', 'Kennedy'],
  'Antioquia': ['Medellín', 'Envigado', 'Itagüí', 'Bello', 'Rionegro'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Buga', 'Tuluá'],
  'Atlántico': ['Barranquilla', 'Soledad', 'Puerto Colombia', 'Malambo'],
  'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
  'Cundinamarca': ['Soacha', 'Chía', 'Zipaquirá', 'Facatativá'],
  'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'],
};

const INITIAL_RADAR_USERS = [
  {
    id: 'user_1',
    name: 'Elena Rostova',
    username: 'elena_r',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    bio: 'Fotógrafa de viajes & Paisajismo alpino. Comprometida con la recolección de plástico.',
    city: 'Medellín',
    department: 'Antioquia',
    area: 'Educación Ambiental',
    mutualFriends: 18,
    isOnline: true,
    status: 'friend',
  },
  {
    id: 'user_2',
    name: 'Alejandro Morales',
    username: 'alexmorales',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    bio: 'Software Engineer | Entusiasta del open source, café de especialidad y economía circular.',
    city: 'Cali',
    department: 'Valle del Cauca',
    area: 'Software & TI',
    mutualFriends: 24,
    isOnline: true,
    status: 'friend',
  },
  {
    id: 'user_3',
    name: 'Valentina Restrepo',
    username: 'valen_eco',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1400&q=80',
    bio: 'Bióloga marina y consultora ambiental. Amante de la flora colombiana.',
    city: 'Bogotá D.C.',
    department: 'Bogotá D.C.',
    area: 'Economía Circular',
    mutualFriends: 32,
    isOnline: false,
    status: 'friend',
  },
  {
    id: 'user_4',
    name: 'Andrés Silva',
    username: 'andres_eco',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80',
    bio: 'Emprendedor de reciclaje industrial y valorización de RAEE.',
    city: 'Bucaramanga',
    department: 'Santander',
    area: 'Gestión de Residuos',
    mutualFriends: 11,
    isOnline: true,
    status: 'friend',
  },
  {
    id: 'user_req_1',
    name: 'María Paula Gómez',
    username: 'mapau_gomez',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
    bio: 'Coordinadora de campañas comunitarias de clasificación de residuos en Bogotá.',
    city: 'Bogotá D.C.',
    department: 'Bogotá D.C.',
    area: 'Comunidad & Voluntariado',
    mutualFriends: 8,
    isOnline: true,
    status: 'request_received',
  },
  {
    id: 'user_req_2',
    name: 'David Alejandro Pérez',
    username: 'david_perez',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
    bio: 'Ingeniero de materiales reciclables y upcycling de madera.',
    city: 'Medellín',
    department: 'Antioquia',
    area: 'Diseño & Upcycling',
    mutualFriends: 12,
    isOnline: false,
    status: 'request_received',
  },
  {
    id: 'user_sug_1',
    name: 'Camila Mendoza',
    username: 'camilamendoza',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    bio: 'Diseñadora gráfica especializada en marcas sostenibles y ecología.',
    city: 'Barranquilla',
    department: 'Atlántico',
    area: 'Diseño & Upcycling',
    mutualFriends: 9,
    isOnline: true,
    status: 'suggestion',
  },
  {
    id: 'user_sug_2',
    name: 'Mateo Gómez',
    username: 'mateo_g',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80',
    bio: 'Ingeniero ambiental enfocado en energías renovables y biomasa.',
    city: 'Pereira',
    department: 'Risaralda',
    area: 'Energías Renovables',
    mutualFriends: 15,
    isOnline: false,
    status: 'suggestion',
  },
  {
    id: 'user_sug_3',
    name: 'Katherine Morán',
    username: 'kathy_moran',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
    bio: 'Docente universitaria y líder de proyectos de compostaje urbano.',
    city: 'Chía',
    department: 'Cundinamarca',
    area: 'Educación Ambiental',
    mutualFriends: 7,
    isOnline: true,
    status: 'suggestion',
  },
];

export const useRadarStore = defineStore('social.radar', () => {
  const eventBus = useEventBus();

  // State
  const users = ref([...INITIAL_RADAR_USERS]);
  const activeTab = ref('friends'); // 'friends' | 'requests' | 'suggestions'
  const searchQuery = ref('');
  const selectedDepartment = ref('');
  const selectedCity = ref('');
  const selectedArea = ref('');
  const radarRange = ref(15);
  const selectedUser = ref(null);
  const isRadarScanning = ref(false);
  const isLoading = ref(false);
  const errorMsg = ref(null);
  const currentUser = ref(CURRENT_USER);

  // Departments list for dropdown
  const departmentsList = ref(Object.keys(COLOMBIAN_CITIES_BY_DEPT));

  // Available cities dependent on selected department
  const availableCities = computed(() => {
    if (!selectedDepartment.value) return [];
    return COLOMBIAN_CITIES_BY_DEPT[selectedDepartment.value] || [];
  });

  // Areas list for dropdown
  const areasList = ref([
    'Software & TI',
    'Economía Circular',
    'Educación Ambiental',
    'Energías Renovables',
    'Diseño & Upcycling',
    'Gestión de Residuos',
    'Comunidad & Voluntariado',
  ]);

  // Derived category lists (Guaranteed arrays)
  const friendsList = computed(() => {
    return users.value.filter((u) => u.status === 'friend');
  });

  const suggestionsList = computed(() => {
    return users.value.filter((u) => u.status === 'suggestion');
  });

  const requestsList = computed(() => {
    return users.value.filter((u) => u.status === 'request_received');
  });

  const friendRequests = requestsList; // backwards compatibility alias
  const friends = friendsList; // backwards compatibility alias
  const suggestions = suggestionsList; // backwards compatibility alias
  const nearbyUsers = suggestionsList; // backwards compatibility alias for useRadar.js
  const acceptedRequests = ref([]);

  const pendingRequestsCount = computed(() => {
    return requestsList.value.length;
  });

  const hasActiveFilters = computed(() => {
    return Boolean(
      searchQuery.value ||
        selectedDepartment.value ||
        selectedCity.value ||
        selectedArea.value
    );
  });

  // Filtered users for the main view grid
  const filteredUsers = computed(() => {
    let list = [];
    if (activeTab.value === 'friends') {
      list = friendsList.value;
    } else if (activeTab.value === 'requests') {
      list = requestsList.value;
    } else if (activeTab.value === 'suggestions') {
      list = suggestionsList.value;
    } else {
      list = users.value;
    }

    // 1. Text search
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.city && u.city.toLowerCase().includes(q)) ||
          (u.department && u.department.toLowerCase().includes(q)) ||
          (u.area && u.area.toLowerCase().includes(q))
      );
    }

    // 2. Department filter
    if (selectedDepartment.value) {
      list = list.filter((u) => u.department === selectedDepartment.value);
    }

    // 3. City filter
    if (selectedCity.value) {
      list = list.filter((u) => u.city === selectedCity.value);
    }

    // 4. Area filter
    if (selectedArea.value) {
      list = list.filter((u) => u.area === selectedArea.value);
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

  // Actions
  const loadUsers = () => {
    // Initial users already loaded, state is ready
    return users.value;
  };

  const loadRadarData = loadUsers;

  const setActiveTab = (tab) => {
    activeTab.value = tab;
  };

  const setSearch = (query) => {
    searchQuery.value = query;
  };

  const setSearchQuery = setSearch;

  const setDepartment = (dept) => {
    selectedDepartment.value = dept;
    selectedCity.value = ''; // Reset city when department changes
  };

  const setCity = (city) => {
    selectedCity.value = city;
  };

  const setArea = (area) => {
    selectedArea.value = area;
  };

  const resetFilters = () => {
    searchQuery.value = '';
    selectedDepartment.value = '';
    selectedCity.value = '';
    selectedArea.value = '';
  };

  const acceptRequest = (userId) => {
    const user = users.value.find((u) => u.id === userId);
    if (user) {
      user.status = 'friend';
      acceptedRequests.value.push(user);
      eventBus.emit(EVENTS.DATA_REFRESH_NEEDED, { type: 'friends' });
    }
  };

  const declineRequest = (userId) => {
    const user = users.value.find((u) => u.id === userId);
    if (user) {
      user.status = 'suggestion';
    }
  };

  const rejectRequest = declineRequest;

  const sendRequest = (userId) => {
    const user = users.value.find((u) => u.id === userId);
    if (user) {
      user.status = 'request_sent';
    }
  };

  const sendFriendRequest = sendRequest;

  const cancelRequest = (userId) => {
    const user = users.value.find((u) => u.id === userId);
    if (user) {
      user.status = 'suggestion';
    }
  };

  const selectUser = (user) => {
    selectedUser.value = user;
  };

  const setRadarRange = (range) => {
    radarRange.value = range;
  };

  const startRadarScan = () => {
    isRadarScanning.value = true;
    setTimeout(() => {
      isRadarScanning.value = false;
    }, 2000);
  };

  return {
    // State
    users,
    activeTab,
    searchQuery,
    selectedDepartment,
    selectedCity,
    selectedArea,
    radarRange,
    selectedUser,
    isRadarScanning,
    isLoading,
    errorMsg,
    currentUser,
    departmentsList,
    areasList,

    // Computeds
    availableCities,
    friendsList,
    suggestionsList,
    requestsList,
    friendRequests,
    friends,
    suggestions,
    nearbyUsers,
    acceptedRequests,
    pendingRequestsCount,
    hasActiveFilters,
    filteredUsers,

    // Methods
    executeAsync,
    loadUsers,
    loadRadarData,
    setActiveTab,
    setSearch,
    setSearchQuery,
    setDepartment,
    setCity,
    setArea,
    resetFilters,
    acceptRequest,
    declineRequest,
    rejectRequest,
    sendRequest,
    sendFriendRequest,
    cancelRequest,
    selectUser,
    setRadarRange,
    startRadarScan,
  };
});
