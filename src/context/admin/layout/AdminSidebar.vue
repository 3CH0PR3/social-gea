<template>
  <aside class="sg-admin-sidebar h-full flex flex-col">
    <!-- Top App Bar en Mobile (< 640px) estilo Android -->
    <header class="sm:hidden flex items-center justify-between h-14 px-3 border-b border-slate-200 bg-white shrink-0">
      <button
        type="button"
        @click="$emit('close')"
        class="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:bg-slate-200 cursor-pointer"
        aria-label="Volver"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>

      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
          sg
        </div>
        <h2 class="font-bold text-sm text-slate-900">Administración Socialgea</h2>
      </div>

      <button
        type="button"
        @click="$emit('close')"
        class="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:bg-slate-200 cursor-pointer"
        aria-label="Cerrar"
      >
        <X class="w-5 h-5" />
      </button>
    </header>

    <!-- Brand / Console Header on Tablet & Desktop (>= 640px) -->
    <div class="hidden sm:flex sg-admin-sidebar__brand">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-sm tracking-tight">
          sg
        </div>
        <div>
          <span class="font-extrabold text-sm tracking-tight text-slate-900 block leading-tight">
            socialgea
          </span>
          <span class="text-[10px] font-bold text-emerald-800 tracking-wider uppercase">
            Admin Console
          </span>
        </div>
      </div>

      <!-- Close button on tablet drawer -->
      <button
        type="button"
        @click="$emit('close')"
        class="lg:hidden w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
        aria-label="Cerrar menú"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Active Role Header Pill & Quick Switcher on Mobile -->
    <div class="px-3.5 py-3 bg-slate-50 border-b border-slate-200 space-y-2 shrink-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span class="text-xs font-extrabold text-slate-900">
            {{ adminUser?.label || 'Super Administrador' }}
          </span>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
          Activo
        </span>
      </div>

      <!-- Switcher accesible en móvil -->
      <div class="pt-1">
        <label class="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
          Cambiar rol de prueba:
        </label>
        <select
          :value="adminUser?.role"
          @change="onRoleChange($event.target.value)"
          class="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
        >
          <option value="super_admin">Super Administrador (Todo)</option>
          <option value="moderator">Moderador de Comunidad</option>
          <option value="company_manager">Gestor de Empresas Aliadas</option>
        </select>
      </div>
    </div>

    <!-- Admin Navigation Links (Filtered strictly by Role Permissions) -->
    <nav class="sg-admin-sidebar__nav">
      <!-- Section: Operaciones -->
      <span
        v-if="canViewDashboard || canViewRewards || canViewModeration"
        class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1"
      >
        Operaciones
      </span>

      <RouterLink
        v-if="canViewDashboard"
        to="/admin/dashboard"
        @click="$emit('close')"
        class="sg-admin-nav-item"
        active-class="is-active"
      >
        <div class="sg-admin-nav-item__left">
          <LayoutDashboard class="w-4 h-4 shrink-0" />
          <span>Dashboard & Analíticas</span>
        </div>
      </RouterLink>

      <RouterLink
        v-if="canViewRewards"
        to="/admin/rewards"
        @click="$emit('close')"
        class="sg-admin-nav-item"
        active-class="is-active"
      >
        <div class="sg-admin-nav-item__left">
          <Gift class="w-4 h-4 shrink-0" />
          <span>Gestión de Premios</span>
        </div>
        <span
          v-if="isCompanyManager"
          class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 uppercase"
        >
          Patrocinios
        </span>
      </RouterLink>

      <RouterLink
        v-if="canViewModeration"
        to="/admin/moderation"
        @click="$emit('close')"
        class="sg-admin-nav-item"
        active-class="is-active"
      >
        <div class="sg-admin-nav-item__left">
          <ShieldAlert class="w-4 h-4 shrink-0" />
          <span>Cola de Moderación</span>
        </div>
        <span
          v-if="pendingReportsCount > 0"
          class="sg-admin-nav-badge sg-admin-nav-badge--danger"
        >
          {{ pendingReportsCount }}
        </span>
      </RouterLink>

      <!-- Section: Ecosistema Circular -->
      <span
        v-if="canViewCompanies || canViewRedemptions"
        class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1 mt-3"
      >
        Ecosistema Circular
      </span>

      <RouterLink
        v-if="canViewCompanies"
        to="/admin/companies"
        @click="$emit('close')"
        class="sg-admin-nav-item"
        active-class="is-active"
      >
        <div class="sg-admin-nav-item__left">
          <Building2 class="w-4 h-4 shrink-0" />
          <span>Empresas & Básculas</span>
        </div>
      </RouterLink>

      <RouterLink
        v-if="canViewRedemptions"
        to="/admin/redemptions"
        @click="$emit('close')"
        class="sg-admin-nav-item"
        active-class="is-active"
      >
        <div class="sg-admin-nav-item__left">
          <Ticket class="w-4 h-4 shrink-0" />
          <span>Canjes & Vouchers</span>
        </div>
      </RouterLink>
    </nav>

    <!-- Bottom Bridge to Social Network & Role Summary -->
    <div class="p-3 border-t border-slate-200 space-y-2 bg-slate-50/70">
      <RouterLink
        to="/feeds"
        class="flex items-center justify-between p-2.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
      >
        <div class="flex items-center gap-2">
          <Compass class="w-4 h-4 text-emerald-700" />
          <span>Ir a la Red Social</span>
        </div>
        <ArrowRight class="w-3.5 h-3.5 text-slate-400" />
      </RouterLink>

      <!-- Logout button in sidebar -->
      <button
        type="button"
        @click="handleLogout"
        class="w-full flex items-center justify-between p-2.5 rounded-md bg-white border border-red-200 text-xs font-bold text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <LogOut class="w-4 h-4 text-red-600" />
          <span>Cerrar sesión admin</span>
        </div>
        <span class="text-[10px] text-red-500 font-semibold">Salir</span>
      </button>

      <div class="px-2 pt-1 pb-1 text-[11px] text-slate-500 font-medium">
        <div class="flex items-center justify-between">
          <span>Alcance del rol:</span>
          <span class="text-emerald-800 font-bold capitalize">{{ isSuperAdmin ? 'Total' : isModerator ? 'Moderación' : 'Empresa Aliada' }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import {
  LayoutDashboard,
  Gift,
  ShieldAlert,
  Building2,
  Ticket,
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  LogOut,
} from 'lucide-vue-next';
import { useAdminAuth } from '../pages/auth/composables/useAdminAuth';
import { useAdminModerationStore } from '../pages/moderation/store/useAdminModeration.store';

const emit = defineEmits(['close']);
const router = useRouter();

const {
  adminUser,
  isSuperAdmin,
  isModerator,
  isCompanyManager,
  canViewDashboard,
  canViewRewards,
  canViewModeration,
  canViewCompanies,
  canViewRedemptions,
  switchRole,
  logout,
} = useAdminAuth();

const moderationStore = useAdminModerationStore();

const pendingReportsCount = computed(() => {
  return moderationStore.pendingCount || 7;
});

function onRoleChange(newRole) {
  switchRole(newRole);
  const currentPath = router.currentRoute.value.path;
  if (newRole === 'moderator' && !currentPath.includes('moderation')) {
    router.push('/admin/moderation');
  } else if (newRole === 'company_manager' && currentPath.includes('moderation')) {
    router.push('/admin/rewards');
  }
}

function handleLogout() {
  emit('close');
  logout();
  router.push('/admin/login');
}
</script>
