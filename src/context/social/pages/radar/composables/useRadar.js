import { storeToRefs } from 'pinia';
import { useRadarStore } from '../store/radarStore';

export function useRadar() {
  const store = useRadarStore();
  const {
    nearbyUsers,
    friendRequests,
    acceptedRequests,
    radarRange,
    selectedUser,
    activeTab,
    currentUser,
    isLoading,
  } = storeToRefs(store);

  return {
    nearbyUsers,
    friendRequests,
    acceptedRequests,
    radarRange,
    selectedUser,
    activeTab,
    currentUser,
    isLoading,

    loadRadarData: store.loadRadarData,
    setRadarRange: store.setRadarRange,
    selectUser: store.selectUser,
    acceptRequest: store.acceptRequest,
    declineRequest: store.declineRequest,
    setActiveTab: store.setActiveTab,
  };
}
