import { storeToRefs } from 'pinia';
import { useNotificationStore } from '../store/notificationStore';

export function useNotifications() {
  const store = useNotificationStore();
  const { notifications, filteredNotifications, unreadCount, filter, isLoading } = storeToRefs(store);

  return {
    notifications,
    filteredNotifications,
    unreadCount,
    filter,
    isLoading,

    loadNotifications: store.loadNotifications,
    markAllAsRead: store.markAllAsRead,
    markAsRead: store.markAsRead,
    setFilter: store.setFilter,
  };
}
