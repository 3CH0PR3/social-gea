<template>
  <aside class="hidden lg:flex flex-col gap-1 w-64 xl:w-72 shrink-0 sticky top-20 select-none pr-2">
    <!-- Profile Shortcut -->
    <RouterLink
      :to="`/profiles/${currentUser.id}`"
      class="flex items-center gap-3.5 p-3 rounded-md hover:bg-slate-200/60 transition-colors text-left group w-full"
    >
      <div class="w-10 h-10 rounded-full p-0.5 bg-emerald-600 shrink-0">
        <SafeImage
          :src="currentUser.avatar"
          :alt="currentUser.name"
          imgClass="w-full h-full rounded-full object-cover"
        />
      </div>
      <div class="flex-1 min-w-0">
        <span class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate block">
          {{ currentUser.name }}
        </span>
        <span class="text-xs text-slate-500 font-medium truncate block">Ver mi perfil</span>
      </div>
    </RouterLink>

    <div class="my-1.5 border-t border-slate-200" />

    <!-- Navigation Links with Readable Desktop Typography -->
    <div class="space-y-1">
      <RouterLink
        to="/feeds"
        class="flex items-center justify-between p-3 rounded-md w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-semibold"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3.5 text-sm">
          <Home class="w-5 h-5 text-emerald-700" />
          <span>Feed Principal</span>
        </div>
      </RouterLink>

      <RouterLink
        to="/radar"
        class="flex items-center justify-between p-3 rounded-md w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-semibold"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3.5 text-sm">
          <Users class="w-5 h-5 text-emerald-700" />
          <span>Amigos</span>
        </div>
      </RouterLink>

      <RouterLink
        to="/historys"
        class="flex items-center justify-between p-3 rounded-md w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-semibold"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3.5 text-sm">
          <Sparkles class="w-5 h-5 text-amber-500" />
          <span>Historias de amigos</span>
        </div>
      </RouterLink>

      <RouterLink
        to="/empresas"
        class="flex items-center justify-between p-3 rounded-md w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-semibold"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3.5 text-sm">
          <Building2 class="w-5 h-5 text-emerald-700" />
          <span>Empresas de Reciclaje</span>
        </div>
        <span class="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
          Nuevo
        </span>
      </RouterLink>

      <RouterLink
        to="/marketplace"
        class="flex items-center justify-between p-3 rounded-md w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-semibold"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3.5 text-sm">
          <Gift class="w-5 h-5 text-teal-600" />
          <span>Premios y Recompensas</span>
        </div>
      </RouterLink>

      <button
        type="button"
        @click="goToSaved"
        class="flex items-center justify-between p-3 rounded-md w-full text-left text-slate-700 hover:bg-slate-200/50 font-semibold transition-colors cursor-pointer"
      >
        <div class="flex items-center gap-3.5 text-sm">
          <Bookmark class="w-5 h-5 text-indigo-500" />
          <span>Guardados</span>
        </div>
      </button>

      <RouterLink
        to="/messenger"
        class="flex items-center justify-between p-3 rounded-md w-full text-left transition-colors text-slate-700 hover:bg-slate-200/50 font-semibold"
        active-class="!bg-emerald-50 !text-emerald-800 !font-bold"
      >
        <div class="flex items-center gap-3.5 text-sm">
          <MessageCircle class="w-5 h-5 text-sky-500" />
          <span>Mensajes & Chats</span>
        </div>
      </RouterLink>
    </div>

    <div class="my-2 border-t border-slate-200" />

    <!-- Accesos Rápidos Funcionales -->
    <div class="px-2 py-1 space-y-1.5">
      <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
        Filtros de Contenido
      </span>
      <div class="space-y-1 pt-0.5">
        <button
          type="button"
          @click="filterByTag('all')"
          class="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-200/50 text-sm text-slate-700 cursor-pointer text-left transition-colors"
        >
          <div class="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            🌐
          </div>
          <span class="truncate font-medium">Todas las publicaciones</span>
        </button>

        <button
          type="button"
          @click="filterByTag('#Naturaleza')"
          class="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-200/50 text-sm text-slate-700 cursor-pointer text-left transition-colors"
        >
          <div class="w-7 h-7 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
            🌿
          </div>
          <span class="truncate font-medium">#Naturaleza & Paisajes</span>
        </button>

        <button
          type="button"
          @click="filterByTag('#Tecnología')"
          class="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-200/50 text-sm text-slate-700 cursor-pointer text-left transition-colors"
        >
          <div class="w-7 h-7 rounded-md bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
            💻
          </div>
          <span class="truncate font-medium">#Tecnología & Innovación</span>
        </button>
      </div>
    </div>

    <div class="mt-auto pt-4 text-xs text-slate-400 px-3 space-y-0.5">
      <p class="font-semibold text-slate-600">Socialgea © 2026</p>
      <p class="text-xs text-slate-400">Plataforma Social & Ecológica</p>
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
