<template>
  <aside class="hidden xl:flex flex-col gap-3.5 w-72 shrink-0 sticky top-18 select-none pl-2">
    <!-- Sponsored Companies Showcase (Patrocinios de Empresas de Colombia) -->
    <div class="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Patrocinado
        </span>
        <span class="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
          Publicidad
        </span>
      </div>

      <div class="space-y-3">
        <!-- Sponsor 1 -->
        <a
          href="https://ecopackcolombia.com"
          target="_blank"
          rel="noopener"
          class="block group cursor-pointer"
        >
          <div class="relative h-24 w-full rounded-xl overflow-hidden bg-slate-100 mb-1.5">
            <SafeImage
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
              alt="EcoPack Colombia"
              imgClass="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              containerClass="w-full h-full"
            />
            <span class="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
              Bogotá, Colombia
            </span>
          </div>
          <h5 class="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
            EcoPack Colombia S.A.S
          </h5>
          <p class="text-[10.5px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
            Empaques biodegradables a base de caña y fécula de maíz para empresas y restaurantes.
          </p>
          <span class="text-[10px] text-emerald-700 font-semibold block mt-1 hover:underline">
            ecopackcolombia.com ↗
          </span>
        </a>

        <div class="border-t border-slate-100" />

        <!-- Sponsor 2 -->
        <a
          href="https://cafeandino.co"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2.5 group cursor-pointer"
        >
          <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
            <SafeImage
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=80"
              alt="Café Andino Gourmet"
              imgClass="w-full h-full object-cover group-hover:scale-105 transition-transform"
              containerClass="w-full h-full"
            />
          </div>
          <div class="min-w-0 flex-1">
            <h5 class="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
              Café Andino Gourmet
            </h5>
            <p class="text-[10px] text-slate-500 truncate">
              Café orgánico de origen · Quindío
            </p>
            <span class="text-[9.5px] text-emerald-700 font-semibold block hover:underline">
              cafeandino.co ↗
            </span>
          </div>
        </a>
      </div>
    </div>

    <!-- Recycling Companies Shortcut Widget -->
    <RouterLink
      to="/empresas"
      class="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors flex items-center gap-2.5 group"
    >
      <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
        <Recycle class="w-4.5 h-4.5" />
      </div>
      <div class="min-w-0 flex-1">
        <h5 class="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
          Empresas de Reciclaje
        </h5>
        <span class="text-[10px] text-slate-500 block truncate">
          Directorio de recolección en Colombia
        </span>
      </div>
    </RouterLink>

    <!-- Contacts list -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between px-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Amigos conectados ({{ onlineUsers.length }})
        </span>
      </div>

      <div class="space-y-0.5">
        <div
          v-for="user in onlineUsers.slice(0, 4)"
          :key="user.id"
          @click="openChat(user)"
          class="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer group"
        >
          <div class="flex items-center gap-2 min-w-0">
            <div class="relative shrink-0">
              <SafeImage
                :src="user.avatar"
                :alt="user.name"
                imgClass="w-7 h-7 rounded-full object-cover"
                containerClass="w-7 h-7 rounded-full"
              />
              <span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>
            <div class="min-w-0">
              <h5 class="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                {{ user.name }}
              </h5>
              <span class="text-[9.5px] text-slate-400 block truncate">
                {{ user.city || 'En línea' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            @click.stop="openChat(user)"
            class="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors opacity-0 group-hover:opacity-100"
            title="Abrir chat"
          >
            <MessageCircle class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Trending in Socialgea -->
    <div class="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
      <div class="flex items-center gap-1.5 text-xs font-bold text-slate-800">
        <TrendingUp class="w-4 h-4 text-emerald-600" />
        <span>Tendencias en Socialgea</span>
      </div>

      <div class="space-y-1.5 text-xs">
        <div class="cursor-pointer group">
          <span class="text-[9.5px] text-slate-400 block font-medium">Colombia · Popular</span>
          <span class="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
            #ReciclajeColombia
          </span>
          <span class="text-[9.5px] text-slate-400 block">24.5K publicaciones</span>
        </div>

        <div class="cursor-pointer group">
          <span class="text-[9.5px] text-slate-400 block font-medium">Sostenibilidad · Tendencia</span>
          <span class="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
            #EconomiaCircular
          </span>
          <span class="text-[9.5px] text-slate-400 block">18.2K publicaciones</span>
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
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import SafeImage from './SafeImage.vue';

const messengerStore = useMessengerStore();
const onlineUsers = computed(() => MOCK_USERS.filter((u) => u.isOnline));

function openChat(user) {
  messengerStore.openWithUser(user);
}
</script>

