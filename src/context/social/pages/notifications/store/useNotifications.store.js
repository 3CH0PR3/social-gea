import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { notificationService } from '../services/notificationService';

export const useNotificationsStore = defineStore('social.notifications', () => {
  const notifications = ref([]);
  const filter = ref('all'); // 'all' | 'unread'
  const isLoading = ref(false);
  const errorMsg = ref(null);

  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.isRead).length;
  });

  const filteredNotifications = computed(() => {
    if (filter.value === 'unread') {
      return notifications.value.filter((n) => !n.isRead);
    }
    return notifications.value;
  });

  const setFilter = (newFilter) => {
    filter.value = newFilter;
  };

  const markAllAsRead = async () => {
    await executeAsync(async () => {
      await notificationService.markAllRead();
      notifications.value.forEach((n) => {
        n.isRead = true;
      });
    });
  };

  const markAsRead = async (id) => {
    const notif = notifications.value.find((n) => n.id === id);
    if (notif && !notif.isRead) {
      notif.isRead = true;
      await notificationService.markAsRead(id);
    }
  };

  const loadNotifications = async () => {
    if (notifications.value.length > 0) return;
    await executeAsync(async () => {
      const data = await notificationService.fetchNotifications();
      notifications.value = data;
    });
  };

  const addMentionNotification = ({ senderName, senderAvatar, commentText }) => {
    notifications.value.unshift({
      id: `notif_${Date.now()}`,
      type: 'comment',
      actorName: senderName || 'Amigo de Socialgea',
      actorAvatar: senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
      targetPreview: `te mencionó en un comentario: "${commentText?.slice(0, 55) || '...'}"`,
      timestamp: 'Ahora mismo',
      isRead: false,
      link: '/feeds',
    });
  };

  return {
    notifications,
    filter,
    filteredNotifications,
    unreadCount,
    isLoading,
    errorMsg,
    executeAsync,
    setFilter,
    markAllAsRead,
    markAsRead,
    loadNotifications,
    addMentionNotification,
  };
});

export const useNotificationStore = useNotificationsStore;
