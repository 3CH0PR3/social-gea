<template>
  <aside class="hidden xl:flex flex-col gap-4 w-72 shrink-0 sticky top-18 h-[calc(100vh-5rem)] overflow-y-auto pl-2 select-none">
    <!-- Radar Widget -->
    <RouterLink
      to="/radar"
      class="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-900 text-white shadow-xs cursor-pointer group hover:shadow-md transition-all relative overflow-hidden"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Radar de Proximidad
        </span>
        <Radar class="w-4 h-4 text-emerald-300 group-hover:rotate-45 transition-transform duration-300" />
      </div>
      <h4 class="text-xs font-bold text-white">4 amigos cerca de ti</h4>
      <p class="text-[11px] text-emerald-200 mt-0.5">
        Toca para abrir el radar interactivo
      </p>
    </RouterLink>

    <!-- Recycling Companies Shortcut Widget -->
    <RouterLink
      to="/empresas"
      class="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all flex items-center gap-3 group"
    >
      <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
        <Recycle class="w-5 h-5" />
      </div>
      <div class="min-w-0 flex-1">
        <h5 class="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
          Empresas de Reciclaje
        </h5>
        <span class="text-[10px] text-slate-500 block truncate">
          Únete a un centro de recolección
        </span>
      </div>
    </RouterLink>

    <!-- Contacts list -->
    <div class="space-y-2">
      <div class="flex items-center justify-between px-2">
        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Contactos en línea ({{ onlineUsers.length }})
        </span>
      </div>

      <div class="space-y-1">
        <div
          v-for="user in onlineUsers"
          :key="user.id"
          @click="openChat(user)"
          class="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-200/50 transition-colors cursor-pointer group"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="relative shrink-0">
              <SafeImage
                :src="user.avatar"
                :alt="user.name"
                imgClass="w-8 h-8 rounded-full object-cover"
                containerClass="w-8 h-8 rounded-full"
              />
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div class="min-w-0">
              <h5 class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                {{ user.name }}
              </h5>
              <span class="text-[10px] text-emerald-600 block truncate">
                {{ user.radarDistance || 'Conectado' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            @click.stop="openChat(user)"
            class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors opacity-0 group-hover:opacity-100"
            title="Abrir chat"
          >
            <MessageCircle class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Trending -->
    <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-bold text-slate-800">
        <TrendingUp class="w-4 h-4 text-emerald-600" />
        <span>Tendencias en Conecta</span>
      </div>

      <div class="space-y-2 text-xs">
        <div class="cursor-pointer group">
          <span class="text-[10px] text-slate-400 block font-medium">Tecnología · Popular</span>
          <span class="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
            #Vue3Modular
          </span>
          <span class="text-[10px] text-slate-400 block">16.8K publicaciones</span>
        </div>

        <div class="cursor-pointer group">
          <span class="text-[10px] text-slate-400 block font-medium">Fotografía · Tendencia</span>
          <span class="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
            #Naturaleza
          </span>
          <span class="text-[10px] text-slate-400 block">28.5K publicaciones</span>
        </div>

        <div class="cursor-pointer group">
          <span class="text-[10px] text-slate-400 block font-medium">Diseño · Destacado</span>
          <span class="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
            #RadarTech
          </span>
          <span class="text-[10px] text-slate-400 block">12.4K publicaciones</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Radar, MessageCircle, TrendingUp, Recycle } from 'lucide-vue-next';
import { MOCK_USERS } from '@/shared/data/initialData';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import SafeImage from './SafeImage.vue';

const messengerStore = useMessengerStore();
const onlineUsers = computed(() => MOCK_USERS.filter((u) => u.isOnline));

function openChat(user) {
  messengerStore.openWithUser(user);
}
</script>
