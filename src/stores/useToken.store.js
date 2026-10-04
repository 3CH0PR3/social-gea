import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export function detectContext() {
  if (typeof window === 'undefined') return 'social';
  const path = window.location.pathname;
  if (path.includes('/member')) return 'member';
  if (path.includes('/company')) return 'company';
  if (path.includes('/central')) return 'central';
  return 'social';
}

export const useTokenStore = defineStore('auth.token', () => {
  const token = ref(localStorage.getItem('social_access_token') || null);
  const refreshToken = ref(localStorage.getItem('social_refresh_token') || null);

  const exists = computed(() => !!token.value);

  const set = (newToken) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('social_access_token', newToken);
    } else {
      localStorage.removeItem('social_access_token');
    }
  };

  const setRefresh = (newRefresh) => {
    refreshToken.value = newRefresh;
    if (newRefresh) {
      localStorage.setItem('social_refresh_token', newRefresh);
    } else {
      localStorage.removeItem('social_refresh_token');
    }
  };

  const getToken = (_ctx) => {
    return token.value;
  };

  const getRefresh = () => {
    return refreshToken.value;
  };

  const clear = () => {
    token.value = null;
    refreshToken.value = null;
    localStorage.removeItem('social_access_token');
    localStorage.removeItem('social_refresh_token');
  };

  return {
    token,
    refreshToken,
    exists,
    set,
    setRefresh,
    getToken,
    getRefresh,
    clear,
  };
});
