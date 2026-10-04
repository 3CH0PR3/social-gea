<template>
  <div class="w-full max-w-md mx-auto space-y-6">
    <!-- Header -->
    <div class="space-y-1.5 text-left">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mb-2">
        <LockKeyhole class="w-6 h-6 stroke-[2]" />
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
        Nueva contraseña
      </h2>
      <p class="text-xs sm:text-sm text-slate-500 font-medium">
        Crea una contraseña segura de mínimo 8 caracteres para proteger tu cuenta.
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
    <form @submit.prevent="submitReset" class="space-y-4">
      <div class="space-y-1.5 text-left">
        <label for="resetPass" class="block text-xs font-bold text-slate-700">
          Nueva contraseña
        </label>
        <div class="relative">
          <input
            id="resetPass"
            v-model="newPassword"
            :type="showPassword ? 'text' : 'password'"
            required
            autocomplete="new-password"
            placeholder="Mínimo 8 caracteres"
            class="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none text-xs sm:text-sm transition-all"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
            :aria-label="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
          >
            <EyeOff v-if="showPassword" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="space-y-1.5 text-left">
        <label for="confirmResetPass" class="block text-xs font-bold text-slate-700">
          Confirmar nueva contraseña
        </label>
        <div class="relative">
          <input
            id="confirmResetPass"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            autocomplete="new-password"
            placeholder="Repite la nueva contraseña"
            class="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none text-xs sm:text-sm transition-all"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
            :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
          >
            <EyeOff v-if="showConfirmPassword" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-2 mt-2"
      >
        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
        <span>{{ isLoading ? 'Guardando...' : 'Restablecer y acceder' }}</span>
      </button>

      <div class="text-center text-xs pt-3">
        <RouterLink
          to="/auth/login"
          class="inline-flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 font-medium transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Volver al inicio de sesión</span>
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { LockKeyhole, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '../stores/useAuth.store';
import { validatePassword, validatePasswordsMatch } from '../composables/rules/authRules';

const router = useRouter();
const authStore = useAuthStore();
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

async function submitReset() {
  errorMessage.value = '';
  const passErr = validatePassword(newPassword.value);
  if (passErr) {
    errorMessage.value = passErr;
    return;
  }

  const matchErr = validatePasswordsMatch(newPassword.value, confirmPassword.value);
  if (matchErr) {
    errorMessage.value = matchErr;
    return;
  }

  isLoading.value = true;
  try {
    await authStore.resetPassword(newPassword.value);
    router.push('/auth/login');
  } catch (err) {
    errorMessage.value = authStore.errorMsg || 'Error al actualizar la contraseña';
  } finally {
    isLoading.value = false;
  }
}
</script>
