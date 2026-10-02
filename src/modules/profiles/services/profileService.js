import { CURRENT_USER, MOCK_USERS } from '@/shared/data/initialData';

export const profileService = {
  async fetchUserProfile(userId) {
    return new Promise((resolve) => {
      if (!userId || userId === CURRENT_USER.id) {
        resolve({ ...CURRENT_USER });
      } else {
        const found = MOCK_USERS.find((u) => u.id === userId);
        resolve(found ? { ...found } : { ...CURRENT_USER });
      }
    });
  },

  async updateBio(newBio) {
    return Promise.resolve(newBio);
  }
};
