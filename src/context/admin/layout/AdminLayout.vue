<template>
  <div class="sg-admin-layout">
    <!-- Desktop Sidebar (Sticky on left >= 1024px) -->
    <AdminSidebar class="hidden lg:flex" />

    <!-- Mobile Drawer Sidebar (< 1024px) Teleported -->
    <Teleport to="body">
      <div
        v-if="isMobileSidebarOpen"
        class="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs lg:hidden"
        @click.self="isMobileSidebarOpen = false"
      >
        <div class="w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col">
          <AdminSidebar @close="isMobileSidebarOpen = false" />
        </div>
      </div>
    </Teleport>

    <!-- Main Stage -->
    <div class="sg-admin-stage">
      <AdminTopbar @toggle-sidebar="isMobileSidebarOpen = !isMobileSidebarOpen" />

      <main class="sg-admin-content">
        <!-- Authorized Route View -->
        <RouterView v-if="isRouteAllowed" />

        <!-- Restricted Role Screen -->
        <div
          v-else
          class="p-8 sm:p-12 max-w-xl mx-auto my-8 bg-white rounded-md border border-slate-200 shadow-card text-center space-y-4"
        >
          <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <ShieldAlert class="w-6 h-6" />
          </div>

          <div class="space-y-1.5">
            <h2 class="text-base font-extrabold text-slate-900">
              Acceso Restringido para tu Rol Actual
            </h2>
            <p class="text-xs text-slate-600 leading-relaxed">
              Tu cuenta está en modo <strong class="text-slate-900">{{ adminUser?.label }}</strong>.
              Este módulo requiere permisos adicionales de administración.
            </p>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 font-medium">
            💡 Puedes usar el selector <strong>"Rol:"</strong> en la barra superior para cambiar a Super Administrador o al rol correspondiente.
          </div>

          <div class="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              @click="redirectToAllowed"
              class="sg-btn sg-btn--primary sg-btn--sm"
            >
              Ir a mi módulo asignado
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { ShieldAlert } from 'lucide-vue-next';
import AdminSidebar from './AdminSidebar.vue';
import AdminTopbar from './AdminTopbar.vue';
import { useAdminAuth } from '../pages/auth/composables/useAdminAuth';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const route = useRoute();
const router = useRouter();
const { canAccess, adminUser } = useAdminAuth();

const isMobileSidebarOpen = ref(false);
useBodyScrollLock(isMobileSidebarOpen);

const isRouteAllowed = computed(() => {
  const p = route.path;
  if (p.includes('/admin/dashboard')) return canAccess('dashboard');
  if (p.includes('/admin/rewards')) return canAccess('rewards');
  if (p.includes('/admin/moderation')) return canAccess('moderation');
  if (p.includes('/admin/companies')) return canAccess('companies');
  if (p.includes('/admin/redemptions')) return canAccess('redemptions');
  return true;
});

function redirectToAllowed() {
  if (canAccess('moderation')) {
    router.push('/admin/moderation');
  } else if (canAccess('rewards')) {
    router.push('/admin/rewards');
  } else if (canAccess('companies')) {
    router.push('/admin/companies');
  } else {
    router.push('/admin/dashboard');
  }
}
</script>

<style src="./AdminLayout.css"></style>
