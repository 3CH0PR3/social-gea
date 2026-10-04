<template>
  <div class="w-full max-w-md mx-auto space-y-6">
    <!-- Header -->
    <div class="space-y-1.5 text-left">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mb-2">
        <KeyRound class="w-6 h-6 stroke-[2]" />
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
        Recupera tu contraseña
      </h2>
      <p class="text-xs sm:text-sm text-slate-500 font-medium">
        Ingresa tu correo electrónico registrado y te enviaremos un código OTP para restablecerla.
      </p>
    </div>

    <!-- Error message banner if any -->
    <div
      v-if="errorMessage"
      class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in"
    >
      <AlertCircle class="w-4 h-4 shrink-0 text-rose-500" />
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitForgot" class="space-y-4">
      <div class="space-y-1.5 text-left">
        <label for="forgotEmail" class="block text-xs font-bold text-slate-700">
          Correo electrónico
        </label>
        <input
          id="forgotEmail"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          placeholder="nombre@email.com"
          class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none text-xs sm:text-sm transition-all"
        />
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-2 mt-2"
      >
        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
        <span>{{ isLoading ? 'Enviando código...' : 'Enviar código de recuperación' }}</span>
      </button>

      <div class="text-center text-xs pt-3">
        <RouterLink
          to="/auth/login"
          class="inline-flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 font-medium transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Volver a iniciar sesión</span>
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { KeyRound, ArrowLeft, AlertCircle, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '../stores/useAuth.store';
import { validateEmail } from '../composables/rules/authRules';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

async function submitForgot() {
  errorMessage.value = '';
  const emailErr = validateEmail(email.value);
  if (emailErr) {
    errorMessage.value = emailErr;
    return;
  }

  isLoading.value = true;
  try {
    await authStore.requestPasswordRecovery(email.value);
    router.push('/auth/verify-otp');
  } catch (err) {
    errorMessage.value = authStore.errorMsg || 'Error al enviar código';
  } finally {
    isLoading.value = false;
  }
}
</script>
