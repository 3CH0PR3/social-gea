<template>
  <div class="w-full max-w-md mx-auto space-y-6">
    <!-- Header -->
    <div class="space-y-1.5 text-left">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mb-2">
        <ShieldCheck class="w-6 h-6 stroke-[2]" />
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
        Verificación de código OTP
      </h2>
      <p class="text-xs sm:text-sm text-slate-500 font-medium">
        Ingresa el código de 6 dígitos enviado a
        <strong class="text-slate-800">{{ authStore.pendingAuth.email || 'tu correo' }}</strong>
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

    <!-- OTP Form -->
    <form @submit.prevent="submitOtp" class="space-y-4">
      <div class="space-y-2 text-left">
        <label class="block text-xs font-bold text-slate-700">
          Código de verificación
        </label>
        <OtpInput v-model="otpCode" :length="6" />

        <!-- Timer / Resend Row -->
        <div class="flex items-center justify-between text-xs pt-1">
          <span class="text-slate-500 font-medium">
            ¿No recibiste el código?
          </span>
          <button
            v-if="canResend"
            type="button"
            @click="handleResend"
            class="text-emerald-700 hover:text-emerald-800 font-bold transition-colors cursor-pointer"
          >
            Reenviar código
          </button>
          <span v-else class="text-slate-500 font-mono font-medium">
            Reenviar en {{ formattedTime }}
          </span>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading || otpCode.length < 6"
        class="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-2 mt-2"
      >
        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
        <span>{{ isLoading ? 'Verificando...' : 'Verificar código' }}</span>
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
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ShieldCheck, ArrowLeft, AlertCircle, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '../stores/useAuth.store';
import { useOtpTimer } from '../composables/useOtpTimer';
import OtpInput from '../components/OtpInput.vue';

const router = useRouter();
const authStore = useAuthStore();
const otpCode = ref('742819');
const errorMessage = ref('');
const isLoading = ref(false);

const { formattedTime, canResend, startTimer } = useOtpTimer(120);

onMounted(() => {
  startTimer(120);
});

async function submitOtp() {
  errorMessage.value = '';
  if (!otpCode.value || otpCode.value.length < 6) {
    errorMessage.value = 'El código debe tener 6 dígitos';
    return;
  }

  isLoading.value = true;
  try {
    await authStore.verifyOtp(otpCode.value);
    router.push('/auth/reset');
  } catch (err) {
    errorMessage.value = authStore.errorMsg || 'Código inválido o expirado';
  } finally {
    isLoading.value = false;
  }
}

function handleResend() {
  startTimer(120);
  if (authStore.pendingAuth.email) {
    authStore.requestPasswordRecovery(authStore.pendingAuth.email);
  }
}
</script>
