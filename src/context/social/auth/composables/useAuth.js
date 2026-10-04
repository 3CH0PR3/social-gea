import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuth.store';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const localError = ref('');

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const toggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };

  const clearErrors = () => {
    localError.value = '';
    authStore.errorMsg = null;
  };

  const handleLogin = async (email, password) => {
    clearErrors();
    if (!email || !password) {
      localError.value = 'Por favor ingresa tu correo y contraseña';
      return;
    }

    try {
      const res = await authStore.login({ email, password });
      if (res.requires2FA) {
        router.push('/auth/2fa');
      } else {
        router.push('/feeds');
      }
    } catch (err) {
      localError.value = authStore.errorMsg || 'No se pudo iniciar sesión';
    }
  };

  const handleRegister = async (form) => {
    clearErrors();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      localError.value = 'Por favor completa todos los campos';
      return;
    }
    if (form.password.length < 8) {
      localError.value = 'La contraseña debe tener mínimo 8 caracteres';
      return;
    }
    if (form.password !== form.confirmPassword) {
      localError.value = 'Las contraseñas no coinciden';
      return;
    }
    if (!form.acceptTerms) {
      localError.value = 'Debes aceptar los Términos y Condiciones';
      return;
    }

    try {
      const res = await authStore.register(form);
      if (res.requiresOtp) {
        router.push('/auth/recovery');
      } else {
        router.push('/feeds');
      }
    } catch (err) {
      localError.value = authStore.errorMsg || 'Error al crear la cuenta';
    }
  };

  const handleForgotPassword = async (email) => {
    clearErrors();
    if (!email) {
      localError.value = 'Por favor ingresa tu correo electrónico';
      return;
    }

    try {
      await authStore.requestPasswordRecovery(email);
      router.push('/auth/recovery');
    } catch (err) {
      localError.value = authStore.errorMsg || 'Error al procesar la solicitud';
    }
  };

  const handleVerifyOtpAndReset = async (code, newPassword, confirmPassword) => {
    clearErrors();
    if (!code || code.length < 6) {
      localError.value = 'El código debe tener 6 dígitos';
      return;
    }
    if (newPassword) {
      if (newPassword.length < 8) {
        localError.value = 'La nueva contraseña debe tener al menos 8 caracteres';
        return;
      }
      if (newPassword !== confirmPassword) {
        localError.value = 'Las contraseñas no coinciden';
        return;
      }
    }

    try {
      await authStore.verifyOtp(code);
      if (newPassword) {
        await authStore.resetPassword(newPassword);
      }
      router.push('/auth/login');
    } catch (err) {
      localError.value = authStore.errorMsg || 'Código inválido o expirado';
    }
  };

  const handleVerify2FA = async (code) => {
    clearErrors();
    if (!code || code.length < 6) {
      localError.value = 'Ingresa el código 2FA completo';
      return;
    }

    try {
      await authStore.verify2FA(code);
      router.push('/feeds');
    } catch (err) {
      localError.value = authStore.errorMsg || 'Código 2FA incorrecto';
    }
  };

  return {
    authStore,
    showPassword,
    showConfirmPassword,
    localError,
    togglePassword,
    toggleConfirmPassword,
    clearErrors,
    handleLogin,
    handleRegister,
    handleForgotPassword,
    handleVerifyOtpAndReset,
    handleVerify2FA,
  };
}
