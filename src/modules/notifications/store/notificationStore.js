import { defineStore } from 'pinia';
import { notificationService } from '../services/notificationService';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    filter: 'all', // 'all' | 'unread'
    isLoading: false,
  }),

  getters: {
    filteredNotifications: (state) => {
      if (state.filter === 'unread') {
        return state.notifications.filter((n) => !n.isRead);
      }
      return state.notifications;
    },

    unreadCount: (state) => {
      return state.notifications.filter((n) => !n.isRead).length;
    },
  },

  actions: {
    async loadNotifications() {
      if (this.notifications.length > 0) return;
      this.isLoading = true;
      try {
        this.notifications = await notificationService.fetchNotifications();
      } finally {
        this.isLoading = false;
      }
    },

    markAllAsRead() {
      notificationService.markAllRead();
      this.notifications.forEach((n) => {
        n.isRead = true;
      });
    },

    markAsRead(notifId) {
      const item = this.notifications.find((n) => n.id === notifId);
      if (item) item.isRead = true;
    },

    setFilter(filterName) {
      this.filter = filterName;
    },

    addMentionNotification({ senderName, senderAvatar, commentText }) {
      this.notifications.unshift({
        id: `notif_${Date.now()}`,
        type: 'mention',
        title: `${senderName} te ha mencionado`,
        message: commentText ? `"${commentText.slice(0, 60)}..."` : 'Te mencionó en un comentario.',
        timestamp: 'Justo ahora',
        isRead: false,
        avatar: senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        link: '/feeds',
      });
    },
  },
});
