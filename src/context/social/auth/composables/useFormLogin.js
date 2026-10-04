import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuth.store';
import { validateEmail, validatePassword } from './rules/authRules';

export function useFormLogin() {
  const router = useRouter();
  const authStore = useAuthStore();

  const step = ref('credentials'); // 'credentials' | 'otp'

  const form = reactive({
    email: 'carlos.mendez@socialgea.co',
    password: 'Socialgea2026!',
    rememberMe: true,
  });

  const otpCode = ref('742819');
  const showPassword = ref(false);
  const errorMessage = ref('');

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const backToCredentials = () => {
    step.value = 'credentials';
    errorMessage.value = '';
    otpCode.value = '742819';
  };

  /**
   * Paso 1: Valida credenciales e inspecciona si el usuario tiene activo el 2FA
   */
  const submit = async () => {
    errorMessage.value = '';

    const emailErr = validateEmail(form.email);
    if (emailErr) {
      errorMessage.value = emailErr;
      return;
    }

    const passErr = validatePassword(form.password);
    if (passErr) {
      errorMessage.value = passErr;
      return;
    }

    try {
      const res = await authStore.login({
        email: form.email,
        password: form.password,
      });

      // Si el perfil del usuario tiene 2FA activado, condicionalmente mostramos el input OTP
      if (res?.requires2FA) {
        step.value = 'otp';
      } else {
        router.push('/feeds');
      }
    } catch (err) {
      errorMessage.value = authStore.errorMsg || 'Credenciales inválidas';
    }
  };

  /**
   * Paso 2: Valida el código OTP de 6 dígitos cuando 2FA está activado
   */
  const submitOtp = async () => {
    errorMessage.value = '';
    if (!otpCode.value || otpCode.value.length < 6) {
      errorMessage.value = 'Ingresa el código OTP completo de 6 dígitos';
      return;
    }

    try {
      await authStore.verify2FA(otpCode.value);
      router.push('/feeds');
    } catch (err) {
      errorMessage.value = authStore.errorMsg || 'Código OTP inválido o expirado';
    }
  };

  return {
    step,
    form,
    otpCode,
    showPassword,
    errorMessage,
    isLoading: authStore.isLoading,
    togglePassword,
    backToCredentials,
    submit,
    submitOtp,
  };
}
