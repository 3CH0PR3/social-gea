import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthService } from '../services/auth.service';

const STORAGE_KEY_TOKEN = 'gea_auth_token';
const STORAGE_KEY_USER = 'gea_auth_user';

export const useAuthStore = defineStore('social.auth', () => {
  const token = ref(localStorage.getItem(STORAGE_KEY_TOKEN) || null);
  const user = ref(
    JSON.parse(localStorage.getItem(STORAGE_KEY_USER) || 'null')
  );
  const isLoading = ref(false);
  const errorMsg = ref(null);
  const pendingAuth = ref({
    email: '',
    requires2FA: false,
    tempToken: null,
    resetToken: null,
  });

  const isAuthenticated = computed(() => Boolean(token.value));

  const executeAsync = async (fn) => {
    errorMsg.value = null;
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      errorMsg.value = err.message || 'Ocurrió un error inesperado';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (credentials) => {
    return await executeAsync(async () => {
      const data = await AuthService.login(credentials);
      if (data.requires2FA) {
        pendingAuth.value = {
          email: credentials.email,
          requires2FA: true,
          tempToken: data.tempToken,
        };
        return { requires2FA: true };
      }

      setSession(data.user, data.tokens.accessToken);
      return { success: true, user: data.user };
    });
  };

  const register = async (payload) => {
    return await executeAsync(async () => {
      const data = await AuthService.register(payload);
      if (data.requiresOtpVerification) {
        pendingAuth.value = {
          email: payload.email,
          requiresOtp: true,
        };
        return { requiresOtp: true };
      }
      setSession(data.user, data.tokens.accessToken);
      return { success: true };
    });
  };

  const requestPasswordRecovery = async (email) => {
    return await executeAsync(async () => {
      const data = await AuthService.forgotPassword({ email });
      pendingAuth.value.email = email;
      return data;
    });
  };

  const verifyOtp = async (code, type = 'recovery') => {
    return await executeAsync(async () => {
      const data = await AuthService.verifyOtp({
        email: pendingAuth.value.email,
        code,
        type,
      });
      pendingAuth.value.resetToken = data.resetToken;
      return data;
    });
  };

  const resetPassword = async (newPassword) => {
    return await executeAsync(async () => {
      const data = await AuthService.resetPassword({
        email: pendingAuth.value.email,
        resetToken: pendingAuth.value.resetToken,
        newPassword,
      });
      pendingAuth.value = { email: '', requires2FA: false, tempToken: null, resetToken: null };
      return data;
    });
  };

  const verify2FA = async (code) => {
    return await executeAsync(async () => {
      const data = await AuthService.verify2FA({
        code,
        tempToken: pendingAuth.value.tempToken,
      });
      setSession(data.user, data.tokens.accessToken);
      pendingAuth.value = { email: '', requires2FA: false, tempToken: null, resetToken: null };
      return data;
    });
  };

  const setSession = (userData, authToken) => {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem(STORAGE_KEY_TOKEN, authToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    if (userData?.twoFactorEnabled !== undefined) {
      localStorage.setItem('gea_2fa_enabled', String(userData.twoFactorEnabled));
      if (userData.email) {
        localStorage.setItem(`gea_2fa_enabled_${userData.email}`, String(userData.twoFactorEnabled));
      }
    }
  };

  const toggleTwoFactor = (enabled, targetEmail = null) => {
    const emailToUse = targetEmail || user.value?.email;
    if (user.value) {
      user.value.twoFactorEnabled = enabled;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user.value));
    }
    localStorage.setItem('gea_2fa_enabled', String(enabled));
    if (emailToUse) {
      localStorage.setItem(`gea_2fa_enabled_${emailToUse}`, String(enabled));
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  return {
    user,
    token,
    isLoading,
    errorMsg,
    pendingAuth,
    isAuthenticated,
    executeAsync,
    login,
    register,
    requestPasswordRecovery,
    verifyOtp,
    resetPassword,
    verify2FA,
    setSession,
    toggleTwoFactor,
    logout,
  };
});
