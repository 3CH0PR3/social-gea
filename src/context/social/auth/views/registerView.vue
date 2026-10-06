<template>
  <div class="w-full max-w-md mx-auto space-y-5">
    <!-- Header matching user screenshot -->
    <div class="space-y-1 text-left">
      <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
        Crea tu cuenta GEA
      </h2>
      <p class="text-xs text-slate-500 font-medium">
        Únete a nuestra plataforma y conecta con el mundo.
      </p>
    </div>

    <!-- Social Login Buttons Row -->
    <SocialProviderButton @provider-click="handleProviderLogin" />

    <!-- Divider: "o usa tu correo" -->
    <div class="relative flex items-center justify-center my-4">
      <div class="border-t border-slate-200 w-full" />
      <span class="bg-white px-3 text-xs text-slate-400 font-medium">
        o usa tu correo
      </span>
    </div>

    <!-- Error message banner if any -->
    <div
      v-if="errorMessage"
      class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in"
    >
      <AlertCircle class="w-4 h-4 shrink-0 text-rose-500" />
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Register Form -->
    <form @submit.prevent="submit" class="space-y-4">
      <!-- Two Columns: Nombre(s) and Apellido paterno -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div class="space-y-1.5">
          <label for="firstName" class="block text-xs font-bold text-slate-700">
            Nombre(s)
          </label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            required
            autocomplete="given-name"
            placeholder="Tu nombre"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none text-xs sm:text-sm transition-all"
          />
        </div>

        <div class="space-y-1.5">
          <label for="lastName" class="block text-xs font-bold text-slate-700">
            Apellido paterno
          </label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            required
            autocomplete="family-name"
            placeholder="Tu apellido"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none text-xs sm:text-sm transition-all"
          />
        </div>
      </div>

      <!-- Email Field -->
      <div class="space-y-1.5 text-left">
        <label for="regEmail" class="block text-xs font-bold text-slate-700">
          Correo electrónico
        </label>
        <input
          id="regEmail"
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
          placeholder="nombre@email.com"
          class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none text-xs sm:text-sm transition-all"
        />
      </div>

      <!-- Password Field -->
      <div class="space-y-1.5 text-left">
        <label for="regPassword" class="block text-xs font-bold text-slate-700">
          Contraseña
        </label>
        <div class="relative">
          <input
            id="regPassword"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            autocomplete="new-password"
            placeholder="Mínimo 8 caracteres"
            class="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none text-xs sm:text-sm transition-all"
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

      <!-- Confirm Password Field -->
      <div class="space-y-1.5 text-left">
        <label for="confirmPassword" class="block text-xs font-bold text-slate-700">
          Confirmar contraseña
        </label>
        <div class="relative">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            autocomplete="new-password"
            placeholder="Vuelve a escribir la contraseña"
            class="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none text-xs sm:text-sm transition-all"
          />
          <button
            type="button"
            @click="toggleConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
            :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
          >
            <EyeOff v-if="showConfirmPassword" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Terms Checkbox -->
      <div class="flex items-center gap-2 pt-1 text-left">
        <input
          id="terms"
          v-model="form.acceptTerms"
          type="checkbox"
          required
          class="w-4 h-4 rounded-sm border-slate-300 text-emerald-700 focus:ring-emerald-600/30 cursor-pointer"
        />
        <label for="terms" class="text-xs text-slate-600 cursor-pointer">
          Acepto los <span class="font-bold text-slate-900">Términos y Condiciones</span>
        </label>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading || !form.acceptTerms"
        class="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-2 mt-2"
      >
        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
        <span>{{ isLoading ? 'Creando cuenta...' : 'Crear cuenta' }}</span>
      </button>

      <!-- Bottom Link -->
      <div class="text-center text-xs pt-2 space-y-2">
        <p class="text-slate-500">
          ¿Ya tienes cuenta?
          <RouterLink
            to="/auth/login"
            class="text-emerald-700 hover:text-emerald-800 font-bold transition-colors ml-1"
          >
            Inicia sesión
          </RouterLink>
        </p>
        <RouterLink
          to="/landing"
          class="text-xs text-emerald-800 hover:text-emerald-900 font-bold block"
        >
          🌱 Conoce cómo funciona el reciclaje y los premios en Colombia →
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-vue-next';
import { useSocialRegister } from '../composables/useSocialRegister';
import { useSocialLogin } from '../composables/useSocialLogin';
import SocialProviderButton from '../components/SocialProviderButton.vue';

const {
  form,
  showPassword,
  showConfirmPassword,
  errorMessage,
  isLoading,
  togglePassword,
  toggleConfirmPassword,
  submit,
} = useSocialRegister();

const { handleProviderLogin } = useSocialLogin();
</script>
