<template>
  <aside class="sg-admin-sidebar">
    <!-- Brand / Console Header -->
    <div class="sg-admin-sidebar__brand">
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

      <!-- Close button on mobile -->
      <button
        type="button"
        @click="$emit('close')"
        class="lg:hidden w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
        aria-label="Cerrar menú"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Active Role Header Pill -->
    <div class="px-3 py-2 bg-slate-100/80 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
        <span class="text-[11px] font-extrabold text-slate-800">
          {{ adminUser?.label || 'Super Administrador' }}
        </span>
      </div>
      <p class="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
        {{ adminUser?.description }}
      </p>
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

      <div class="px-2 pt-1 text-[11px] text-slate-500 font-medium">
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
import { RouterLink } from 'vue-router';
import {
  LayoutDashboard,
  Gift,
  ShieldAlert,
  Building2,
  Ticket,
  Compass,
  ArrowRight,
  X,
} from 'lucide-vue-next';
import { useAdminAuth } from '../pages/auth/composables/useAdminAuth';
import { useAdminModerationStore } from '../pages/moderation/store/useAdminModeration.store';

defineEmits(['close']);

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
} = useAdminAuth();

const moderationStore = useAdminModerationStore();

const pendingReportsCount = computed(() => {
  return moderationStore.pendingCount || 7;
});
</script>
