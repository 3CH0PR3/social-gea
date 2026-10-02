import { MOCK_USERS } from '@/shared/data/initialData';

export const radarService = {
  async fetchNearbyUsers(rangeMeters = 2000) {
    return Promise.resolve([...MOCK_USERS]);
  },

  async fetchFriendRequests() {
    return Promise.resolve([
      {
        id: 'req_1',
        user: MOCK_USERS[3], // Marcos Benítez
        mutualFriends: 8,
        timestamp: 'Hace 1 hora',
      }
    ]);
  }
};
