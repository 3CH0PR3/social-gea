<template>
  <div class="w-full max-w-md mx-auto space-y-5">
    <!-- ==========================================
         PASO 1: CREDENCIALES (Email y Contraseña)
         ========================================== -->
    <template v-if="step === 'credentials'">
      <!-- Header -->
      <div class="space-y-1 text-left">
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          Bienvenido a GEA-social
        </h2>
        <p class="text-xs text-slate-500 font-medium">
          Inicia sesión en tu cuenta para continuar.
        </p>
      </div>

      <!-- Social Login Buttons Row -->
      <SocialProviderButton @provider-click="handleProviderLogin" />

      <!-- Divider: "o" -->
      <div class="relative flex items-center justify-center my-3">
        <div class="border-t border-slate-200 w-full" />
        <span class="bg-white px-3 text-xs text-slate-400 font-medium lowercase">
          o
        </span>
      </div>

      <!-- Error message banner if any -->
      <div
        v-if="errorMessage"
        class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in"
      >
        <AlertCircle class="w-4 h-4 shrink-0 text-rose-500" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="submit" class="space-y-3.5">
        <!-- Email Field -->
        <div class="space-y-1 text-left">
          <label for="email" class="block text-xs font-bold text-slate-700">
            Correo electrónico
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            placeholder="nombre@email.com"
            class="w-full px-3 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none text-xs sm:text-sm transition-all"
          />
        </div>

        <!-- Password Field -->
        <div class="space-y-1 text-left">
          <label for="password" class="block text-xs font-bold text-slate-700">
            Contraseña
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="Escribe tu contraseña aquí"
              class="w-full px-3 py-2 pr-10 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none text-xs sm:text-sm transition-all"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
            >
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-2 mt-1"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          <span>{{ isLoading ? 'Comprobando seguridad...' : 'Iniciar sesión' }}</span>
        </button>

        <!-- Bottom Links -->
        <div class="flex items-center justify-between text-xs pt-1">
          <p class="text-slate-500">
            ¿No tienes cuenta?
            <RouterLink
              to="/auth/register"
              class="text-emerald-700 hover:text-emerald-800 font-bold transition-colors ml-1"
            >
              Regístrate
            </RouterLink>
          </p>

          <RouterLink
            to="/auth/forgot"
            class="text-slate-500 hover:text-emerald-700 transition-colors font-medium"
          >
            ¿Olvidaste tu contraseña?
          </RouterLink>
        </div>
      </form>
    </template>

    <!-- ==============================================================
         PASO 2: CONDICIONAL - COMPONENTE OTP (Si 2FA está activo)
         ============================================================== -->
    <template v-else-if="step === 'otp'">
      <!-- Header -->
      <div class="space-y-1 text-left animate-in fade-in slide-in-from-top-2 duration-200">
        <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 mb-1">
          <Smartphone class="w-5 h-5 stroke-[2]" />
        </div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          Autenticación en dos pasos (2FA)
        </h2>
        <p class="text-xs text-slate-500 font-medium">
          Tu perfil tiene activa la protección 2FA. Ingresa el código OTP de 6 dígitos enviado a
          <strong class="text-slate-800">{{ form.email }}</strong>.
        </p>
      </div>

      <!-- Error message banner if any -->
      <div
        v-if="errorMessage"
        class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in"
      >
        <AlertCircle class="w-4 h-4 shrink-0 text-rose-500" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- OTP Form with Component -->
      <form @submit.prevent="submitOtp" class="space-y-4 animate-in fade-in duration-200">
        <div class="space-y-2 text-left">
          <label class="block text-xs font-bold text-slate-700">
            Código de seguridad OTP
          </label>
          <!-- Componente OTP condicional -->
          <OtpInput v-model="otpCode" :length="6" />

          <!-- Resend Row -->
          <div class="flex items-center justify-between text-xs pt-1">
            <span class="text-slate-500 font-medium">¿No recibiste el token?</span>
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
          <span>{{ isLoading ? 'Verificando token...' : 'Confirmar acceso' }}</span>
        </button>

        <div class="text-center text-xs pt-1">
          <button
            type="button"
            @click="backToCredentials"
            class="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>Volver a ingresar credenciales</span>
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { Eye, EyeOff, AlertCircle, Loader2, Smartphone, ArrowLeft } from 'lucide-vue-next';
import { useFormLogin } from '../composables/useFormLogin';
import { useSocialLogin } from '../composables/useSocialLogin';
import { useOtpTimer } from '../composables/useOtpTimer';
import SocialProviderButton from '../components/SocialProviderButton.vue';
import OtpInput from '../components/OtpInput.vue';

const {
  step,
  form,
  otpCode,
  showPassword,
  errorMessage,
  isLoading,
  togglePassword,
  backToCredentials,
  submit,
  submitOtp,
} = useFormLogin();

const { handleProviderLogin } = useSocialLogin();
const { formattedTime, canResend, startTimer } = useOtpTimer(120);

onMounted(() => {
  startTimer(120);
});

function handleResend() {
  startTimer(120);
}
</script>
