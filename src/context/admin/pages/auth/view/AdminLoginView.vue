<template>
  <div class="min-h-screen min-h-[100dvh] bg-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-md shadow-2xl border border-slate-800 overflow-hidden">
      <!-- Admin Header Banner -->
      <div class="p-6 bg-slate-950 text-white text-center border-b border-slate-800">
        <div class="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-lg mx-auto mb-3 shadow-md">
          sg
        </div>
        <h1 class="text-lg font-black tracking-tight leading-tight">
          Socialgea Admin Portal
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          Consola Central de Operaciones y Moderación · Colombia
        </p>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleLogin" class="p-6 space-y-4 text-xs">
        <div v-if="error" class="p-3 rounded-md bg-red-50 border border-red-200 text-red-900 font-semibold">
          {{ error }}
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-slate-700">Correo Electrónico Corporativo</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@socialgea.co"
            class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 font-semibold"
          />
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-slate-700">Contraseña de Acceso</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••••••"
            class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-slate-900 font-semibold"
          />
        </div>

        <!-- Role Selector (Para pruebas de roles solicitadas) -->
        <div class="space-y-1 pt-1">
          <label class="block font-bold text-slate-700">Perfil / Rol a Autenticar</label>
          <select
            v-model="selectedRole"
            class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 text-slate-900 font-bold cursor-pointer"
          >
            <option value="super_admin">Super Administrador (Catálogo, métricas, todo)</option>
            <option value="moderator">Moderador de Comunidad (Queues, reportes)</option>
            <option value="company_manager">Gestor de Empresas (Básculas y acopios)</option>
          </select>
        </div>

        <!-- Submit Button -->
        <div class="pt-3">
          <button
            type="submit"
            class="sg-btn sg-btn--primary sg-btn--block"
            :disabled="isLoading"
          >
            <ShieldCheck class="w-4 h-4" />
            <span>{{ isLoading ? 'Verificando credenciales...' : 'Ingresar a la Consola Admin' }}</span>
          </button>
        </div>

        <!-- Bridge to social network -->
        <div class="pt-4 border-t border-slate-100 text-center">
          <RouterLink
            to="/feeds"
            class="text-xs text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1.5"
          >
            <Compass class="w-3.5 h-3.5 text-emerald-700" />
            <span>Volver a la Red Social Socialgea</span>
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { ShieldCheck, Compass } from 'lucide-vue-next';
import { useAdminAuth } from '../composables/useAdminAuth';

const router = useRouter();
const { login, isLoading, error } = useAdminAuth();

const email = ref('admin@socialgea.co');
const password = ref('password123');
const selectedRole = ref('super_admin');

async function handleLogin() {
  const success = await login(email.value, password.value, selectedRole.value);
  if (success) {
    router.push('/admin/dashboard');
  }
}
</script>
