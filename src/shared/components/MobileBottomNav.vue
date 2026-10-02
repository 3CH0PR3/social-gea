<template>
  <nav class="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 h-14 grid grid-cols-6 items-center px-0.5 shadow-lg select-none">
    <RouterLink
      to="/feeds"
      class="flex flex-col items-center justify-center min-h-[44px] transition-colors text-slate-500 hover:text-slate-800"
      active-class="!text-emerald-600 !font-bold"
    >
      <Home class="w-4.5 h-4.5" />
      <span class="text-[9px] mt-0.5">Inicio</span>
    </RouterLink>

    <RouterLink
      to="/radar"
      class="flex flex-col items-center justify-center min-h-[44px] transition-colors relative text-slate-500 hover:text-slate-800"
      active-class="!text-emerald-600 !font-bold"
    >
      <Users class="w-4.5 h-4.5" />
      <span class="text-[9px] mt-0.5">Amigos</span>
    </RouterLink>

    <RouterLink
      to="/empresas"
      class="flex flex-col items-center justify-center min-h-[44px] transition-colors text-slate-500 hover:text-slate-800"
      active-class="!text-emerald-600 !font-bold"
    >
      <Building2 class="w-4.5 h-4.5" />
      <span class="text-[9px] mt-0.5 truncate max-w-[48px]">Empresas</span>
    </RouterLink>

    <RouterLink
      to="/historys"
      class="flex flex-col items-center justify-center min-h-[44px] transition-colors text-slate-500 hover:text-slate-800"
      active-class="!text-emerald-600 !font-bold"
    >
      <Sparkles class="w-4.5 h-4.5" />
      <span class="text-[9px] mt-0.5">Historias</span>
    </RouterLink>

    <RouterLink
      to="/notifications"
      class="flex flex-col items-center justify-center min-h-[44px] transition-colors relative text-slate-500 hover:text-slate-800"
      active-class="!text-emerald-600 !font-bold"
    >
      <Bell class="w-4.5 h-4.5" />
      <span
        v-if="unreadCount > 0"
        class="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center"
      >
        {{ unreadCount }}
      </span>
      <span class="text-[9px] mt-0.5">Alertas</span>
    </RouterLink>

    <RouterLink
      to="/profiles"
      class="flex flex-col items-center justify-center min-h-[44px] transition-colors text-slate-500 hover:text-slate-800"
      active-class="!text-emerald-600 !font-bold"
    >
      <User class="w-4.5 h-4.5" />
      <span class="text-[9px] mt-0.5">Perfil</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Home, Users, Building2, Sparkles, Bell, User } from 'lucide-vue-next';
import { useNotificationStore } from '@/modules/notifications/store/notificationStore';

const notificationStore = useNotificationStore();
const unreadCount = computed(() => notificationStore.unreadCount);
</script>
