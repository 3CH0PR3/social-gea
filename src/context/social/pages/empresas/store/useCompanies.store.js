import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { MOCK_EMPRESAS } from '../data/mockEmpresas';
import { CURRENT_USER } from '@/shared/data/initialData';
import { useEventBus, EVENTS } from '@/shared/composables/useEventBus';

const STORAGE_KEY_SUBSCRIPTION = 'socialgea_empresa_sub';
const STORAGE_KEY_HISTORY = 'socialgea_empresa_history';

export const useEmpresasStore = defineStore('social.companies', () => {
  const eventBus = useEventBus();

  // Helper interno de lectura de storage
  const getInitialSubscription = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SUBSCRIPTION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getInitialHistory = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // State
  const empresas = ref([...MOCK_EMPRESAS]);
  const currentUser = ref(CURRENT_USER);
  const activeSubscription = ref(getInitialSubscription());
  const subscriptionHistory = ref(getInitialHistory());
  const searchQuery = ref('');
  const selectedCategory = ref('todas');
  const isLoading = ref(false);
  const errorMsg = ref(null);

  // Modals state
  const isDetailModalOpen = ref(false);
  const selectedEmpresaForDetail = ref(null);
  const isSubscribeModalOpen = ref(false);
  const selectedEmpresaForSubscribe = ref(null);
  const isCancelModalOpen = ref(false);
  const isApplicationDetailModalOpen = ref(false);
  const toastMessage = ref(null);

  // Computeds (anteriormente getters en versión 2)
  const hasActiveSubscription = computed(() => Boolean(activeSubscription.value));

  const activeEmpresa = computed(() => {
    if (!activeSubscription.value) return null;
    return empresas.value.find((e) => e.id === activeSubscription.value.empresaId) || null;
  });

  const getEmpresaById = computed(() => (id) => {
    return empresas.value.find((e) => e.id === id) || null;
  });

  const filteredEmpresas = computed(() => {
    let list = empresas.value;

    if (selectedCategory.value && selectedCategory.value !== 'todas') {
      list = list.filter((e) => e.category === selectedCategory.value);
    }

    if (searchQuery.value && searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.materials.some((m) => m.toLowerCase().includes(q))
      );
    }

    return list;
  });

  const categories = computed(() => {
    const cats = new Set(empresas.value.map((e) => e.category));
    return ['todas', ...Array.from(cats)];
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

  // Actions / Methods
  const saveSubscriptionToStorage = () => {
    try {
      if (activeSubscription.value) {
        localStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(activeSubscription.value));
      } else {
        localStorage.removeItem(STORAGE_KEY_SUBSCRIPTION);
      }
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(subscriptionHistory.value));
    } catch (e) {
      console.warn('No se pudo guardar la suscripción en localStorage', e);
    }
  };

  const showToast = (msg) => {
    toastMessage.value = msg;
    setTimeout(() => {
      if (toastMessage.value === msg) {
        toastMessage.value = null;
      }
    }, 4000);
  };

  const openDetailModal = (empresa) => {
    selectedEmpresaForDetail.value = empresa;
    isDetailModalOpen.value = true;
  };

  const closeDetailModal = () => {
    isDetailModalOpen.value = false;
    selectedEmpresaForDetail.value = null;
  };

  const openSubscribeModal = (empresa) => {
    selectedEmpresaForSubscribe.value = empresa;
    isSubscribeModalOpen.value = true;
  };

  const closeSubscribeModal = () => {
    isSubscribeModalOpen.value = false;
    selectedEmpresaForSubscribe.value = null;
  };

  const subscribeToEmpresa = async (empresa, formData = {}) => {
    return executeAsync(async () => {
      const subRecord = {
        id: 'sub_' + Date.now(),
        empresaId: empresa.id,
        empresaName: empresa.name,
        empresaLogo: empresa.logo,
        empresaLocation: empresa.location,
        empresaIncentive: empresa.incentive,
        date: new Date().toISOString(),
        status: 'activa',
        userRole: formData.userRole || 'Reciclador urbano',
        materialsOffered: formData.materialsOffered || empresa.materials.slice(0, 2),
        collectionMode: formData.collectionMode || 'Entrega en punto físico',
        phone: formData.phone || '',
        notes: formData.notes || '',
        numacro: formData.numacro || '',
        documentType: formData.documentType || 'Cédula de Ciudadanía',
        documentNumber: formData.documentNumber || '',
        neighborhood: formData.neighborhood || '',
        monthlyVolumeEst: formData.monthlyVolumeEst || 'Menos de 20 kg',
      };

      activeSubscription.value = subRecord;
      subscriptionHistory.value.unshift(subRecord);
      saveSubscriptionToStorage();

      showToast(`¡Te has vinculado exitosamente a ${empresa.name}!`);
      eventBus.emit(EVENTS.SUBSCRIPTION_UPDATED, subRecord);
      closeSubscribeModal();
      return subRecord;
    });
  };

  const cancelSubscription = async (reason = '') => {
    return executeAsync(async () => {
      if (!activeSubscription.value) return;

      const cancelledRecord = {
        ...activeSubscription.value,
        status: 'cancelada',
        cancelledAt: new Date().toISOString(),
        cancelReason: reason,
      };

      const idx = subscriptionHistory.value.findIndex((s) => s.id === activeSubscription.value.id);
      if (idx !== -1) {
        subscriptionHistory.value[idx] = cancelledRecord;
      } else {
        subscriptionHistory.value.unshift(cancelledRecord);
      }

      const prevEmpresaName = activeSubscription.value.empresaName;
      activeSubscription.value = null;
      saveSubscriptionToStorage();

      showToast(`Se ha cancelado tu vinculación con ${prevEmpresaName}.`);
      eventBus.emit(EVENTS.SUBSCRIPTION_CANCELLED, { reason });
      isCancelModalOpen.value = false;
    });
  };

  const setCategory = (cat) => {
    selectedCategory.value = cat;
  };

  const setSearchQuery = (q) => {
    searchQuery.value = q;
  };

  return {
    // State
    empresas,
    currentUser,
    activeSubscription,
    subscriptionHistory,
    searchQuery,
    selectedCategory,
    isLoading,
    errorMsg,
    isDetailModalOpen,
    selectedEmpresaForDetail,
    isSubscribeModalOpen,
    selectedEmpresaForSubscribe,
    isCancelModalOpen,
    isApplicationDetailModalOpen,
    toastMessage,

    // Computeds
    hasActiveSubscription,
    activeEmpresa,
    getEmpresaById,
    filteredEmpresas,
    categories,

    // Methods
    executeAsync,
    openDetailModal,
    openDetail: openDetailModal,
    closeDetailModal,
    closeDetail: closeDetailModal,
    openSubscribeModal,
    openSubscribe: openSubscribeModal,
    closeSubscribeModal,
    closeSubscribe: closeSubscribeModal,
    subscribeToEmpresa,
    submitSubscription: subscribeToEmpresa,
    cancelSubscription,
    openCancelConfirm: () => { isCancelModalOpen.value = true; },
    closeCancelConfirm: () => { isCancelModalOpen.value = false; },
    openApplicationDetails: () => { isApplicationDetailModalOpen.value = true; },
    closeApplicationDetails: () => { isApplicationDetailModalOpen.value = false; },
    setCategory,
    setSearchQuery,
    setSearch: setSearchQuery,
    showToast,
  };
});

// Alias para compatibilidad con código existente
export const useEmpresaStore = useEmpresasStore;
