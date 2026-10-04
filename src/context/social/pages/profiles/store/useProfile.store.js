import { ref } from 'vue';
import { defineStore } from 'pinia';
import { profileService } from '../services/profileService';
import { CURRENT_USER } from '@/shared/data/initialData';
import { useEventBus, EVENTS } from '@/shared/composables/useEventBus';

export const useProfileStore = defineStore('social.profile', () => {
  const eventBus = useEventBus();

  const currentUser = ref(CURRENT_USER);
  const activeProfile = ref(CURRENT_USER);
  const activeTab = ref('posts'); // 'posts' | 'photos' | 'about'
  const isLoading = ref(false);
  const errorMsg = ref(null);

  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err?.message || 'Error inesperado';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const loadProfile = async (userId) => {
    return executeAsync(async () => {
      const data = await profileService.fetchUserProfile(userId);
      activeProfile.value = data;
      return data;
    });
  };

  const updateBio = async (newBio) => {
    return executeAsync(async () => {
      await profileService.updateBio(newBio);
      if (activeProfile.value) {
        activeProfile.value.bio = newBio;
      }
      if (currentUser.value) {
        currentUser.value.bio = newBio;
      }
      eventBus.emit(EVENTS.USER_PROFILE_UPDATED, { bio: newBio });
    });
  };

  const updateAvatar = (newAvatarUrl) => {
    if (activeProfile.value) activeProfile.value.avatar = newAvatarUrl;
    if (currentUser.value) currentUser.value.avatar = newAvatarUrl;
    eventBus.emit(EVENTS.USER_AVATAR_UPDATED, { avatar: newAvatarUrl });
  };

  const updateCover = (newCoverUrl) => {
    if (activeProfile.value) activeProfile.value.coverImage = newCoverUrl;
    if (currentUser.value) currentUser.value.coverImage = newCoverUrl;
    eventBus.emit(EVENTS.USER_COVER_UPDATED, { coverImage: newCoverUrl });
  };

  const setActiveTab = (tabName) => {
    activeTab.value = tabName;
  };

  return {
    currentUser,
    activeProfile,
    activeTab,
    isLoading,
    errorMsg,
    executeAsync,
    loadProfile,
    updateBio,
    updateAvatar,
    updateCover,
    setActiveTab,
  };
});
