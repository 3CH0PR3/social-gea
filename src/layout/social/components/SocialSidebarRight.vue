<template>
  <aside class="hidden xl:flex flex-col gap-4 w-72 lg:w-80 shrink-0 sticky top-20 select-none pl-2">
    <!-- Sponsored Companies Showcase -->
    <div class="p-4 rounded-md bg-white border border-slate-200 shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
          Patrocinado
        </span>
        <span class="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
          Publicidad
        </span>
      </div>

      <div class="space-y-3.5">
        <!-- Sponsor 1 -->
        <a
          href="https://ecopackcolombia.com"
          target="_blank"
          rel="noopener"
          class="block group cursor-pointer"
        >
          <div class="relative h-28 w-full rounded-md overflow-hidden bg-slate-100 mb-2">
            <SafeImage
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
              alt="EcoPack Colombia"
              imgClass="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              containerClass="w-full h-full"
            />
            <span class="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-xs font-medium px-2 py-0.5 rounded-md">
              Bogotá, Colombia
            </span>
          </div>
          <h5 class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
            EcoPack Colombia S.A.S
          </h5>
          <p class="text-xs text-slate-600 leading-snug line-clamp-2 mt-1">
            Empaques biodegradables a base de caña y fécula de maíz para empresas y restaurantes.
          </p>
          <span class="text-xs text-emerald-700 font-bold block mt-1 hover:underline">
            ecopackcolombia.com ↗
          </span>
        </a>

        <div class="border-t border-slate-100" />

        <!-- Sponsor 2 -->
        <a
          href="https://cafeandino.co"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-3 group cursor-pointer"
        >
          <div class="w-14 h-14 rounded-md overflow-hidden bg-slate-100 shrink-0">
            <SafeImage
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=80"
              alt="Café Andino Gourmet"
              imgClass="w-full h-full object-cover group-hover:scale-105 transition-transform"
              containerClass="w-full h-full"
            />
          </div>
          <div class="min-w-0 flex-1">
            <h5 class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
              Café Andino Gourmet
            </h5>
            <p class="text-xs text-slate-500 truncate">
              Café orgánico de origen · Quindío
            </p>
            <span class="text-xs text-emerald-700 font-bold block hover:underline mt-0.5">
              cafeandino.co ↗
            </span>
          </div>
        </a>
      </div>
    </div>

    <!-- Recycling Companies Shortcut Widget -->
    <RouterLink
      to="/empresas"
      class="p-3.5 rounded-md bg-white border border-slate-200 shadow-xs hover:border-emerald-500 transition-colors flex items-center gap-3 group"
    >
      <div class="w-10 h-10 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
        <Recycle class="w-5 h-5" />
      </div>
      <div class="min-w-0 flex-1">
        <h5 class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
          Empresas de Reciclaje
        </h5>
        <span class="text-xs text-slate-500 block truncate">
          Directorio de recolección en Colombia
        </span>
      </div>
    </RouterLink>

    <!-- Contacts list -->
    <div class="space-y-2">
      <div class="flex items-center justify-between px-2">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
          Amigos conectados ({{ onlineUsers.length }})
        </span>
      </div>

      <div class="space-y-1">
        <div
          v-for="user in onlineUsers.slice(0, 4)"
          :key="user.id"
          @click="openChat(user)"
          class="flex items-center justify-between p-2 rounded-md hover:bg-slate-200/50 transition-colors cursor-pointer group"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative shrink-0">
              <SafeImage
                :src="user.avatar"
                :alt="user.name"
                imgClass="w-9 h-9 rounded-full object-cover"
                containerClass="w-9 h-9 rounded-full"
              />
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div class="min-w-0">
              <h5 class="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                {{ user.name }}
              </h5>
              <span class="text-xs text-slate-400 block truncate">
                {{ user.city || 'En línea' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            @click.stop="openChat(user)"
            class="p-1.5 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors opacity-0 group-hover:opacity-100"
            title="Abrir chat"
          >
            <MessageCircle class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Trending in Socialgea -->
    <div class="p-4 rounded-md bg-white border border-slate-200 shadow-xs space-y-3">
      <div class="flex items-center gap-2 text-sm font-bold text-slate-900">
        <TrendingUp class="w-4.5 h-4.5 text-emerald-700" />
        <span>Tendencias en Socialgea</span>
      </div>

      <div class="space-y-2 text-xs sm:text-sm">
        <div class="cursor-pointer group">
          <span class="text-xs text-slate-400 block font-medium">Colombia · Popular</span>
          <span class="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
            #ReciclajeColombia
          </span>
          <span class="text-xs text-slate-400 block mt-0.5">24.5K publicaciones</span>
        </div>

        <div class="cursor-pointer group">
          <span class="text-xs text-slate-400 block font-medium">Sostenibilidad · Tendencia</span>
          <span class="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
            #EconomiaCircular
          </span>
          <span class="text-xs text-slate-400 block mt-0.5">18.2K publicaciones</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { MessageCircle, TrendingUp, Recycle } from 'lucide-vue-next';
import { MOCK_USERS } from '@/shared/data/initialData';
import { useMessengerStore } from '@/context/social/pages/messenger/store/messengerStore';
import SafeImage from './SafeImage.vue';

const messengerStore = useMessengerStore();
const onlineUsers = computed(() => MOCK_USERS.filter((u) => u.isOnline));

function openChat(user) {
  messengerStore.openWithUser(user);
}
</script>
