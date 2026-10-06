import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { RewardsStorageService } from '@/shared/services/rewardsStorage.service';
import { useEventBus, EVENTS } from '@/shared/composables/useEventBus';

export const useMarketplaceStore = defineStore('social.marketplace', () => {
  const eventBus = useEventBus();

  // State
  const items = ref(RewardsStorageService.list());
  const searchQuery = ref('');
  const selectedCategory = ref('');
  const selectedPointsRange = ref('');
  const selectedDeliveryMethod = ref('');
  const userPoints = ref(1250);
  const isLoading = ref(false);
  const errorMsg = ref(null);

  // Escuchar sincronización en tiempo real desde el admin o cualquier otra vista
  eventBus.on(EVENTS.REWARDS_SYNCED, (payload) => {
    if (payload?.items && Array.isArray(payload.items)) {
      items.value = payload.items;
    } else {
      items.value = RewardsStorageService.list();
    }
  });

  const userClassifications = ref([
    {
      id: 'cl_1',
      material: 'PET Transparente (Botellas)',
      amount: '18.5 kg',
      pointsEarned: 370,
      enterprise: 'Recicladora Metropolitana Bogotá',
      date: 'Hace 2 días',
    },
    {
      id: 'cl_2',
      material: 'Cartón & Papel Archivo',
      amount: '24.0 kg',
      pointsEarned: 240,
      enterprise: 'Recicladora Metropolitana Bogotá',
      date: 'Hace 5 días',
    },
    {
      id: 'cl_3',
      material: 'Chatarra Electrónica RAEE',
      amount: '11.0 kg',
      pointsEarned: 640,
      enterprise: 'TechCycle Colombia',
      date: 'Hace 1 semana',
    },
  ]);

  const redeemedRewards = ref([
    {
      id: 'red_demo',
      itemTitle: 'Botella Térmica de Acero Inoxidable 750ml',
      pointsSpent: 290,
      ticketCode: 'ECO-COL-94821',
      date: 'Ayer a las 16:30',
      status: 'Listo para retiro',
      deliveryMethod: 'Retiro en centro de reciclaje',
      enterprise: 'Recicladora Metropolitana Bogotá',
    },
  ]);

  const activeRedeemItem = ref(null);
  const isRedeemModalOpen = ref(false);

  // Computeds
  const categoriesList = computed(() => {
    const set = new Set(items.value.map((i) => i.category));
    return Array.from(set);
  });

  const hasActiveFilters = computed(() => {
    return Boolean(
      searchQuery.value ||
        selectedCategory.value ||
        selectedPointsRange.value ||
        selectedDeliveryMethod.value
    );
  });

  const filteredItems = computed(() => {
    return items.value.filter((item) => {
      // 1. Text Search
      if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesEnterprise = item.enterprise.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesEnterprise) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory.value && item.category !== selectedCategory.value) {
        return false;
      }

      // 3. Delivery Method Filter
      if (
        selectedDeliveryMethod.value &&
        item.deliveryMethod !== selectedDeliveryMethod.value
      ) {
        return false;
      }

      // 4. Points Range Filter
      if (selectedPointsRange.value) {
        if (selectedPointsRange.value === 'affordable') {
          if (item.pointsCost > userPoints.value) return false;
        } else if (selectedPointsRange.value === '0-300') {
          if (item.pointsCost > 300) return false;
        } else if (selectedPointsRange.value === '301-600') {
          if (item.pointsCost < 301 || item.pointsCost > 600) return false;
        } else if (selectedPointsRange.value === '601+') {
          if (item.pointsCost <= 600) return false;
        }
      }

      return true;
    });
  });

  const affordableItems = computed(() => {
    return items.value.filter((item) => item.pointsCost <= userPoints.value);
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
  const setCategory = (cat) => {
    selectedCategory.value = selectedCategory.value === cat ? '' : cat;
  };

  const setPointsRange = (range) => {
    selectedPointsRange.value = selectedPointsRange.value === range ? '' : range;
  };

  const setDeliveryMethod = (method) => {
    selectedDeliveryMethod.value = selectedDeliveryMethod.value === method ? '' : method;
  };

  const setSearchQuery = (query) => {
    searchQuery.value = query;
  };

  const resetFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = '';
    selectedPointsRange.value = '';
    selectedDeliveryMethod.value = '';
  };

  const openRedeemModal = (item) => {
    activeRedeemItem.value = item;
    isRedeemModalOpen.value = true;
  };

  const closeRedeemModal = () => {
    isRedeemModalOpen.value = false;
    activeRedeemItem.value = null;
  };

  const redeemActiveItem = async (deliveryData = {}) => {
    return executeAsync(async () => {
      if (!activeRedeemItem.value) return null;

      const item = activeRedeemItem.value;
      if (userPoints.value < item.pointsCost) {
        throw new Error('Puntos insuficientes para canjear este premio');
      }

      userPoints.value -= item.pointsCost;

      const newRedemption = {
        id: 'red_' + Date.now(),
        itemTitle: item.title,
        pointsSpent: item.pointsCost,
        ticketCode: 'ECO-COL-' + Math.floor(10000 + Math.random() * 90000),
        date: 'Hace un momento',
        status: deliveryData.method === 'domicilio' ? 'En preparación para envío' : 'Listo para retiro',
        deliveryMethod: deliveryData.method === 'domicilio' ? 'Envío a domicilio' : 'Retiro en centro de acopio',
        enterprise: item.enterprise,
        address: deliveryData.address || '',
      };

      redeemedRewards.value.unshift(newRedemption);
      eventBus.emit(EVENTS.POINTS_UPDATED, { remainingPoints: userPoints.value });
      eventBus.emit(EVENTS.REWARD_REDEEMED, newRedemption);

      closeRedeemModal();
      return newRedemption;
    });
  };

  return {
    // State
    items,
    searchQuery,
    selectedCategory,
    selectedPointsRange,
    selectedDeliveryMethod,
    userPoints,
    userClassifications,
    redeemedRewards,
    activeRedeemItem,
    isRedeemModalOpen,
    isLoading,
    errorMsg,

    // Computeds
    categoriesList,
    hasActiveFilters,
    filteredItems,
    affordableItems,

    // Methods
    executeAsync,
    setCategory,
    setPointsRange,
    setDeliveryMethod,
    setSearchQuery,
    resetFilters,
    openRedeemModal,
    closeRedeemModal,
    redeemActiveItem,
    reloadRewards: () => {
      items.value = RewardsStorageService.list();
    },
  };
});
