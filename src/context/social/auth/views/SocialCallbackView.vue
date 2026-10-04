<template>
  <div class="w-full max-w-md mx-auto text-center space-y-4 py-8">
    <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
      <Loader2 class="w-7 h-7 animate-spin" />
    </div>
    <div class="space-y-1">
      <h2 class="text-xl font-bold text-slate-900 font-display">
        Autenticando con tu proveedor...
      </h2>
      <p class="text-xs sm:text-sm text-slate-500">
        Estamos configurando tu sesión de Socialgea. Un momento por favor.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '../stores/useAuth.store';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  // Simular lectura de query params de callback OAuth
  setTimeout(() => {
    authStore.login({
      email: 'carlos.mendez@socialgea.co',
      password: 'Socialgea2026!',
    }).then(() => {
      router.push('/feeds');
    }).catch(() => {
      router.push('/auth/login');
    });
  }, 800);
});
</script>
