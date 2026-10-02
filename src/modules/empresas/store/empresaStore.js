import { defineStore } from 'pinia';
import { MOCK_EMPRESAS } from '../data/mockEmpresas';
import { CURRENT_USER } from '@/shared/data/initialData';

const STORAGE_KEY_SUBSCRIPTION = 'conecta_radar_empresa_sub';
const STORAGE_KEY_HISTORY = 'conecta_radar_empresa_history';

function loadStoredSubscription() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBSCRIPTION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadStoredHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useEmpresaStore = defineStore('empresa', {
  state: () => ({
    empresas: [...MOCK_EMPRESAS],
    currentUser: CURRENT_USER,
    activeSubscription: loadStoredSubscription(),
    subscriptionHistory: loadStoredHistory(),
    searchQuery: '',
    selectedCategory: 'todas',
    
    // Modals
    isDetailModalOpen: false,
    selectedEmpresaForDetail: null,
    
    isSubscribeModalOpen: false,
    selectedEmpresaForSubscribe: null,
    
    isCancelModalOpen: false,
    isApplicationDetailModalOpen: false,

    // Feedback toast
    toastMessage: null,
  }),

  getters: {
    hasActiveSubscription: (state) => !!state.activeSubscription,
    activeEmpresa: (state) => {
      if (!state.activeSubscription) return null;
      return state.empresas.find((e) => e.id === state.activeSubscription.empresaId) || null;
    },
    getEmpresaById: (state) => (id) => {
      return state.empresas.find((e) => e.id === id) || null;
    },
    filteredEmpresas: (state) => {
      let list = state.empresas;

      if (state.selectedCategory && state.selectedCategory !== 'todas') {
        list = list.filter((e) => e.category === state.selectedCategory);
      }

      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        list = list.filter((e) =>
          e.name.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.acceptedMaterials.some((m) => m.label.toLowerCase().includes(q))
        );
      }

      return list;
    },
    categories: (state) => {
      const set = new Set(state.empresas.map((e) => e.category));
      return ['todas', ...Array.from(set)];
    }
  },

  actions: {
    showToast(message) {
      this.toastMessage = message;
      setTimeout(() => {
        if (this.toastMessage === message) {
          this.toastMessage = null;
        }
      }, 4000);
    },

    openDetail(empresa) {
      this.selectedEmpresaForDetail = empresa;
      this.isDetailModalOpen = true;
    },

    closeDetail() {
      this.isDetailModalOpen = false;
      this.selectedEmpresaForDetail = null;
    },

    openSubscribe(empresa) {
      // If already subscribed to any company, do not open subscribe modal
      if (this.hasActiveSubscription) {
        this.showToast('Ya tienes una empresa suscrita. Para cambiarte, primero cancela tu suscripción actual.');
        return;
      }
      this.selectedEmpresaForSubscribe = empresa;
      this.isSubscribeModalOpen = true;
    },

    closeSubscribe() {
      this.isSubscribeModalOpen = false;
      this.selectedEmpresaForSubscribe = null;
    },

    submitSubscription(empresaId, formData) {
      const empresa = this.empresas.find((e) => e.id === empresaId);
      if (!empresa) return false;

      const subRecord = {
        empresaId: empresa.id,
        empresaName: empresa.name,
        empresaLogo: empresa.logo,
        empresaCategory: empresa.category,
        applicationId: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        subscribedAt: new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'activa',
        formData: {
          numacro: formData.numacro || 'MAC-01',
          nuis: formData.nuis || '10928472',
          address: formData.address || this.currentUser.location || 'Calle 72 # 11-45, Apto 302',
          userUsage: formData.userUsage || '1 — Residencial',
          userType: formData.userType || '2 — Pequeño generador',
          multiuser: formData.multiuser || '2 — No multiusuario',
          fullName: formData.fullName || this.currentUser.name,
          email: formData.email || `${this.currentUser.username}@radar.io`,
          phone: formData.phone || '+34 600 123 456',
          deliveryMode: formData.deliveryMode || 'domicilio',
          materialsSelected: [...(formData.materialsSelected || [])],
          notes: formData.notes || '',
        }
      };

      this.activeSubscription = subRecord;
      this.subscriptionHistory.unshift({ ...subRecord, archivedAt: null });

      try {
        localStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(subRecord));
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.subscriptionHistory));
      } catch (e) {
        console.error('Storage error', e);
      }

      this.closeSubscribe();
      this.showToast(`¡Te has suscrito exitosamente a ${empresa.name}!`);
      return true;
    },

    openCancelConfirm() {
      this.isCancelModalOpen = true;
    },

    closeCancelConfirm() {
      this.isCancelModalOpen = false;
    },

    cancelSubscription() {
      if (!this.activeSubscription) return;

      const prevName = this.activeSubscription.empresaName;

      // Update in history
      const currentInHist = this.subscriptionHistory.find(
        (h) => h.applicationId === this.activeSubscription.applicationId
      );
      if (currentInHist) {
        currentInHist.status = 'cancelada';
        currentInHist.archivedAt = new Date().toLocaleDateString('es-ES');
      }

      this.activeSubscription = null;

      try {
        localStorage.removeItem(STORAGE_KEY_SUBSCRIPTION);
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.subscriptionHistory));
      } catch (e) {
        console.error('Storage error', e);
      }

      this.closeCancelConfirm();
      this.showToast(`Has cancelado tu suscripción con ${prevName}. Ahora puedes suscribirte a otra empresa.`);
    },

    openApplicationDetails() {
      this.isApplicationDetailModalOpen = true;
    },

    closeApplicationDetails() {
      this.isApplicationDetailModalOpen = false;
    },

    setCategory(category) {
      this.selectedCategory = category;
    },

    setSearch(query) {
      this.searchQuery = query;
    }
  }
});
