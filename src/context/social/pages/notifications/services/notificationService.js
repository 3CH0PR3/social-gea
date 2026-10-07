import mockNotifications from './mocks/mockNotifications.json';

export const notificationService = {
  async fetchNotifications() {
    return Promise.resolve(JSON.parse(JSON.stringify(mockNotifications)));
  },

  async markAllRead() {
    return Promise.resolve(true);
  },

  async markAsRead(id) {
    return Promise.resolve(id);
  }
};
