import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/useAuth.store';
import {
  validateEmail,
  validatePassword,
  validatePasswordsMatch,
  validateName,
} from './rules/authRules';

export function useSocialRegister() {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    referralCode: '',
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  });

  onMounted(() => {
    if (route.query?.ref) {
      form.referralCode = String(route.query.ref).trim().toUpperCase();
    }
  });

  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const errorMessage = ref('');

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const toggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };

  const submit = async () => {
    errorMessage.value = '';

    const firstErr = validateName(form.firstName, 'nombre');
    if (firstErr) {
      errorMessage.value = firstErr;
      return;
    }

    const lastErr = validateName(form.lastName, 'apellido paterno');
    if (lastErr) {
      errorMessage.value = lastErr;
      return;
    }

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

    const matchErr = validatePasswordsMatch(form.password, form.confirmPassword);
    if (matchErr) {
      errorMessage.value = matchErr;
      return;
    }

    if (!form.acceptTerms) {
      errorMessage.value = 'Debes aceptar los Términos y Condiciones';
      return;
    }

    try {
      const res = await authStore.register(form);
      if (res?.requiresOtp) {
        router.push('/auth/verify-otp');
      } else {
        router.push('/feeds');
      }
    } catch (err) {
      errorMessage.value = authStore.errorMsg || 'Error al registrar la cuenta';
    }
  };

  return {
    form,
    showPassword,
    showConfirmPassword,
    errorMessage,
    isLoading: authStore.isLoading,
    togglePassword,
    toggleConfirmPassword,
    submit,
  };
}
