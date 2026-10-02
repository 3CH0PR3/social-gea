<template>
  <aside class="hidden lg:flex flex-col gap-1 w-64 shrink-0 sticky top-18 h-[calc(100vh-5rem)] overflow-y-auto pr-2 select-none">
    <!-- Profile Shortcut -->
    <RouterLink
      :to="`/profiles/${currentUser.id}`"
      class="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-200/60 transition-colors text-left group w-full"
    >
      <div class="w-9 h-9 rounded-full p-0.5 bg-emerald-500/80 shrink-0">
        <SafeImage
          :src="currentUser.avatar"
          :alt="currentUser.name"
          imgClass="w-full h-full rounded-full object-cover"
        />
      </div>
      <div class="flex-1 min-w-0">
        <span class="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate block">
          {{ currentUser.name }}
        </span>
        <span class="text-[11px] text-slate-500 truncate block">Ver mi perfil</span>
      </div>
    </RouterLink>

    <div class="my-1 border-t border-slate-200/80" />

    <!-- Links -->
    <div class="space-y-0.5">
      <RouterLink
        to="/feeds"
        class="flex items-center justify-between p-2.5 rounded-2xl w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-medium"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3 text-xs">
          <Home class="w-5 h-5 text-emerald-600" />
          <span>Feed Principal</span>
        </div>
      </RouterLink>

      <RouterLink
        to="/radar"
        class="flex items-center justify-between p-2.5 rounded-2xl w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-medium"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3 text-xs">
          <div class="relative">
            <Radar class="w-5 h-5 text-emerald-600 animate-spin" style="animation-duration: 8s;" />
            <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span>Radar de Amigos</span>
        </div>
        <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
          En vivo
        </span>
      </RouterLink>

      <RouterLink
        to="/historys"
        class="flex items-center justify-between p-2.5 rounded-2xl w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-medium"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3 text-xs">
          <Sparkles class="w-5 h-5 text-amber-500" />
          <span>Historias</span>
        </div>
      </RouterLink>

      <RouterLink
        to="/empresas"
        class="flex items-center justify-between p-2.5 rounded-2xl w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-medium"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3 text-xs">
          <Building2 class="w-5 h-5 text-emerald-600" />
          <span>Empresas de Reciclaje</span>
        </div>
        <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
          Nuevo
        </span>
      </RouterLink>

      <RouterLink
        to="/marketplace"
        class="flex items-center justify-between p-2.5 rounded-2xl w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-medium"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3 text-xs">
          <Store class="w-5 h-5 text-teal-600" />
          <span>Marketplace Verde</span>
        </div>
      </RouterLink>

      <button
        type="button"
        @click="goToSaved"
        class="flex items-center justify-between p-2.5 rounded-2xl w-full text-left text-slate-700 hover:bg-slate-200/50 font-medium transition-colors cursor-pointer"
      >
        <div class="flex items-center gap-3 text-xs">
          <Bookmark class="w-5 h-5 text-indigo-500" />
          <span>Guardados</span>
        </div>
      </button>

      <RouterLink
        to="/messenger"
        class="flex items-center justify-between p-2.5 rounded-2xl w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-medium"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3 text-xs">
          <MessageCircle class="w-5 h-5 text-sky-500" />
          <span>Mensajes & Chats</span>
        </div>
      </RouterLink>
    </div>

    <div class="my-2 border-t border-slate-200/80" />

    <div class="px-2 py-1">
      <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Comunidades Radar
      </span>
      <div class="mt-2 space-y-1">
        <RouterLink
          to="/feeds"
          class="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-200/50 text-xs text-slate-700 cursor-pointer"
        >
          <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            📸
          </div>
          <span class="truncate">Fotografía y Paisajes</span>
        </RouterLink>
        <RouterLink
          to="/feeds"
          class="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-200/50 text-xs text-slate-700 cursor-pointer"
        >
          <div class="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
            💻
          </div>
          <span class="truncate">Desarrolladores Vue 3</span>
        </RouterLink>
      </div>
    </div>

    <div class="mt-auto pt-4 text-[11px] text-slate-400 px-2 space-y-1">
      <p>Conecta Radar · Vue 3</p>
      <p class="text-[10px] text-slate-400">Modular por Features</p>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { Home, Radar, Sparkles, Building2, Store, Bookmark, MessageCircle } from 'lucide-vue-next';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import SafeImage from './SafeImage.vue';

const feedStore = useFeedStore();
const router = useRouter();
const currentUser = feedStore.currentUser;

function goToSaved() {
  feedStore.setFilter('saved');
  router.push('/feeds');
}
</script>
