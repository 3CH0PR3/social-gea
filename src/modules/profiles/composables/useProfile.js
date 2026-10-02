import { storeToRefs } from 'pinia';
import { useProfileStore } from '../store/profileStore';

export function useProfile() {
  const store = useProfileStore();
  const { activeProfile, currentUser, activeTab, isLoading } = storeToRefs(store);

  return {
    activeProfile,
    currentUser,
    activeTab,
    isLoading,

    loadProfile: store.loadProfile,
    updateBio: store.updateBio,
    setActiveTab: store.setActiveTab,
  };
}
