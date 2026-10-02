import { storeToRefs } from 'pinia';
import { useHistoryStore } from '../store/historyStore';

export function useHistorys() {
  const store = useHistoryStore();
  const { stories, viewer, isCreateModalOpen, currentUser } = storeToRefs(store);

  return {
    stories,
    viewer,
    isCreateModalOpen,
    currentUser,

    loadStories: store.loadStories,
    openStoryViewer: store.openStoryViewer,
    closeStoryViewer: store.closeStoryViewer,
    openCreateModal: store.openCreateModal,
    closeCreateModal: store.closeCreateModal,
    addStoryItem: store.addStoryItem,
  };
}
