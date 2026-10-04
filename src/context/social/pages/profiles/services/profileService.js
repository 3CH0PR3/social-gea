import { CURRENT_USER, MOCK_USERS } from '@/shared/data/initialData';

export const profileService = {
  async fetchUserProfile(userId) {
    return new Promise((resolve) => {
      if (!userId || userId === CURRENT_USER.id) {
        resolve({ ...CURRENT_USER });
      } else {
        const found = MOCK_USERS.find((u) => u.id === userId || u.username === userId);
        if (found) {
          resolve({
            ...found,
            bio: found.bio || 'Miembro de la comunidad Socialgea 🌿',
            work: found.work || 'Profesional en Socialgea',
            location: found.location || 'Colombia',
            hometown: found.hometown || 'Colombia',
            friendsCount: found.friendsCount || 350,
            postsCount: found.postsCount || 12,
            coverImage: found.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
          });
        } else {
          resolve({
            id: userId,
            name: 'Amigo de Socialgea',
            username: `user_${userId}`,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
            bio: 'Miembro de la comunidad de reciclaje Socialgea 🌱',
            work: 'Colaborador Ambiental',
            location: 'Colombia',
            hometown: 'Colombia',
            friendsCount: 240,
            postsCount: 8,
            isOnline: true,
            isFriend: true
          });
        }
      }
    });
  },

  async updateBio(newBio) {
    return Promise.resolve(newBio);
  }
};
