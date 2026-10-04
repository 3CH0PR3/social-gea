import { INITIAL_NOTIFICATIONS } from '@/shared/data/initialData';

export const notificationService = {
  async fetchNotifications() {
    return Promise.resolve([...INITIAL_NOTIFICATIONS]);
  },

  async markAllRead() {
    return Promise.resolve(true);
  }
};
