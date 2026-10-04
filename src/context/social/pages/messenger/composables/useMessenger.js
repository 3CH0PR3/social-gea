import { storeToRefs } from 'pinia';
import { useMessengerStore } from '../store/messengerStore';

export function useMessenger() {
  const store = useMessengerStore();
  const {
    conversations,
    activeChatUser,
    isDrawerOpen,
    unreadCount,
    currentConversation,
    currentUser,
    isLoading,
  } = storeToRefs(store);

  return {
    conversations,
    activeChatUser,
    isDrawerOpen,
    unreadCount,
    currentConversation,
    currentUser,
    isLoading,

    loadConversations: store.loadConversations,
    openWithUser: store.openWithUser,
    toggleDrawer: store.toggleDrawer,
    closeDrawer: store.closeDrawer,
    sendMessage: store.sendMessage,
  };
}
