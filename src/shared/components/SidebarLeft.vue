<template>
  <aside class="hidden lg:flex flex-col gap-1 w-64 shrink-0 sticky top-18 select-none pr-2">
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

    <!-- Navigation Links -->
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

      <!-- Amigos (clean icon, no live badge, no radar animation) -->
      <RouterLink
        to="/radar"
        class="flex items-center justify-between p-2.5 rounded-2xl w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-medium"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3 text-xs">
          <Users class="w-5 h-5 text-emerald-600" />
          <span>Amigos</span>
        </div>
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

      <!-- Premios y Recompensas (replaces Marketplace Verde) -->
      <RouterLink
        to="/marketplace"
        class="flex items-center justify-between p-2.5 rounded-2xl w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-medium"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3 text-xs">
          <Gift class="w-5 h-5 text-teal-600" />
          <span>Premios y Recompensas</span>
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

    <div class="my-1.5 border-t border-slate-200/80" />

    <!-- Accesos Rápidos Funcionales (Replaces inactive comunidades radar) -->
    <div class="px-2 py-1 space-y-1">
      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Filtros de Contenido
      </span>
      <div class="space-y-0.5 pt-0.5">
        <button
          type="button"
          @click="filterByTag('all')"
          class="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-200/50 text-xs text-slate-700 cursor-pointer text-left transition-colors"
        >
          <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
            🌐
          </div>
          <span class="truncate font-medium">Todas las publicaciones</span>
        </button>

        <button
          type="button"
          @click="filterByTag('#Naturaleza')"
          class="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-200/50 text-xs text-slate-700 cursor-pointer text-left transition-colors"
        >
          <div class="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px]">
            🌿
          </div>
          <span class="truncate font-medium">#Naturaleza & Paisajes</span>
        </button>

        <button
          type="button"
          @click="filterByTag('#Tecnología')"
          class="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-200/50 text-xs text-slate-700 cursor-pointer text-left transition-colors"
        >
          <div class="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[11px]">
            💻
          </div>
          <span class="truncate font-medium">#Tecnología & Innovación</span>
        </button>
      </div>
    </div>

    <div class="mt-auto pt-3 text-[11px] text-slate-400 px-2 space-y-0.5">
      <p class="font-semibold text-slate-500">Socialgea © 2026</p>
      <p class="text-[10px] text-slate-400">Plataforma Social & Ecológica</p>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { Home, Users, Sparkles, Building2, Gift, Bookmark, MessageCircle } from 'lucide-vue-next';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import SafeImage from './SafeImage.vue';

const feedStore = useFeedStore();
const router = useRouter();
const currentUser = feedStore.currentUser;

function goToSaved() {
  feedStore.setFilter('saved');
  router.push('/feeds');
}

function filterByTag(tag) {
  if (tag === 'all') {
    feedStore.setSearch('');
  } else {
    feedStore.setSearch(tag);
  }
  router.push('/feeds');
}
</script>
