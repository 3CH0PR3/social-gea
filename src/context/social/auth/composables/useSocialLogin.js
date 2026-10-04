import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuth.store';

export function useSocialLogin() {
  const router = useRouter();
  const authStore = useAuthStore();

  const handleProviderLogin = async (provider) => {
    try {
      await authStore.login({
        email: `${provider.toLowerCase()}@socialgea.co`,
        password: 'Socialgea2026!',
      });
      router.push('/feeds');
    } catch (err) {
      console.error('Social login error:', err);
    }
  };

  return {
    handleProviderLogin,
  };
}
