import { defineStore } from 'pinia';
import { profileService } from '../services/profileService';
import { CURRENT_USER } from '@/shared/data/initialData';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    currentUser: CURRENT_USER,
    activeProfile: CURRENT_USER,
    activeTab: 'posts', // 'posts' | 'photos' | 'about'
    isLoading: false,
  }),

  actions: {
    async loadProfile(userId) {
      this.isLoading = true;
      try {
        this.activeProfile = await profileService.fetchUserProfile(userId);
      } finally {
        this.isLoading = false;
      }
    },

    async updateBio(newBio) {
      await profileService.updateBio(newBio);
      this.activeProfile.bio = newBio;
      if (this.activeProfile.id === this.currentUser.id) {
        this.currentUser.bio = newBio;
      }
    },

    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
  },
});
