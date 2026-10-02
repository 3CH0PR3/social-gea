import { storeToRefs } from 'pinia';
import { useEmpresaStore } from '../store/empresaStore';

export function useEmpresas() {
  const store = useEmpresaStore();
  const {
    empresas,
    currentUser,
    activeSubscription,
    subscriptionHistory,
    searchQuery,
    selectedCategory,
    isDetailModalOpen,
    selectedEmpresaForDetail,
    isSubscribeModalOpen,
    selectedEmpresaForSubscribe,
    isCancelModalOpen,
    isApplicationDetailModalOpen,
    toastMessage,
    hasActiveSubscription,
    activeEmpresa,
    filteredEmpresas,
    categories,
  } = storeToRefs(store);

  return {
    empresas,
    currentUser,
    activeSubscription,
    subscriptionHistory,
    searchQuery,
    selectedCategory,
    isDetailModalOpen,
    selectedEmpresaForDetail,
    isSubscribeModalOpen,
    selectedEmpresaForSubscribe,
    isCancelModalOpen,
    isApplicationDetailModalOpen,
    toastMessage,
    hasActiveSubscription,
    activeEmpresa,
    filteredEmpresas,
    categories,

    openDetail: store.openDetail,
    closeDetail: store.closeDetail,
    openSubscribe: store.openSubscribe,
    closeSubscribe: store.closeSubscribe,
    submitSubscription: store.submitSubscription,
    openCancelConfirm: store.openCancelConfirm,
    closeCancelConfirm: store.closeCancelConfirm,
    cancelSubscription: store.cancelSubscription,
    openApplicationDetails: store.openApplicationDetails,
    closeApplicationDetails: store.closeApplicationDetails,
    setCategory: store.setCategory,
    setSearch: store.setSearch,
    showToast: store.showToast,
  };
}
