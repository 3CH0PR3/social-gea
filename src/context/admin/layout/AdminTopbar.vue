<template>
  <header class="sg-admin-topbar">
    <div class="flex items-center gap-3">
      <!-- Mobile hamburger to toggle sidebar -->
      <button
        type="button"
        @click="$emit('toggle-sidebar')"
        class="lg:hidden w-9 h-9 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center cursor-pointer"
        aria-label="Abrir menú"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div>
        <h2 class="text-sm font-extrabold text-slate-900 leading-tight">
          Administración Socialgea
        </h2>
        <span class="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Ecosistema Circular & Moderación en Vivo
        </span>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Role Switcher Simulator (para pruebas rápidas de permisos) -->
      <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs">
        <span class="text-[10px] font-bold text-slate-500 uppercase px-1 hidden md:inline">
          Rol:
        </span>
        <select
          :value="adminUser?.role"
          @change="onRoleChange($event.target.value)"
          class="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer"
          title="Cambiar rol para simular permisos"
        >
          <option value="super_admin">Super Administrador</option>
          <option value="moderator">Moderador</option>
          <option value="company_manager">Gestor de Empresas</option>
        </select>
      </div>

      <!-- Admin Profile Dropdown trigger -->
      <div class="relative">
        <button
          type="button"
          @click="isDropdownOpen = !isDropdownOpen"
          class="flex items-center gap-2 p-1 rounded-md hover:bg-slate-100 cursor-pointer"
        >
          <img
            :src="adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'"
            :alt="adminUser?.name"
            class="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
          />
          <div class="hidden sm:block text-left">
            <span class="text-xs font-bold text-slate-900 block leading-tight">
              {{ adminUser?.name || 'Administrador' }}
            </span>
            <span class="text-[10px] text-slate-500 font-medium">
              {{ adminUser?.label || adminUser?.roleLabel || 'Staff' }}
            </span>
          </div>
          <ChevronDown class="w-3.5 h-3.5 text-slate-400" />
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 top-11 w-56 bg-white rounded-md shadow-lg border border-slate-200 py-1.5 z-50"
          @click="isDropdownOpen = false"
        >
          <div class="px-3 py-2 border-b border-slate-100">
            <span class="text-xs font-bold text-slate-900 block">{{ adminUser?.name }}</span>
            <span class="text-[11px] text-slate-500 block">{{ adminUser?.email }}</span>
          </div>

          <RouterLink
            to="/feeds"
            class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Compass class="w-4 h-4 text-emerald-700" />
            <span>Muro Socialgea</span>
          </RouterLink>

          <RouterLink
            to="/admin/dashboard"
            class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <LayoutDashboard class="w-4 h-4 text-slate-500" />
            <span>Consola de Control</span>
          </RouterLink>

          <div class="border-t border-slate-100 mt-1 pt-1">
            <button
              type="button"
              @click="handleLogout"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 text-left cursor-pointer"
            >
              <LogOut class="w-4 h-4 text-red-600" />
              <span>Cerrar sesión admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { Menu, ChevronDown, Compass, LayoutDashboard, LogOut } from 'lucide-vue-next';
import { useAdminAuth } from '../pages/auth/composables/useAdminAuth';

defineEmits(['toggle-sidebar']);

const router = useRouter();
const { adminUser, switchRole, logout } = useAdminAuth();
const isDropdownOpen = ref(false);

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
  logout();
  router.push('/admin/login');
}
</script>
