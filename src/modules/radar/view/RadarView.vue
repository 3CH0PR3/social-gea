<template>
  <div class="w-full max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Hero Banner -->
    <div class="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
      <div class="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6">
        <RadarLogo :size="320" />
      </div>

      <div class="relative z-10 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-3 border border-white/10">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Radar Social Activo en Tiempo Real</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight font-display text-white">
          Explora conexiones a tu alrededor
        </h1>
        <p class="text-emerald-100/90 text-sm mt-2 leading-relaxed">
          Descubre amigos, creadores y comunidades cercanas sincronizadas con tu radar. Conéctate al instante e interactúa con sus historias.
        </p>
      </div>

      <!-- Switcher Tabs -->
      <div class="flex items-center gap-2 mt-6 relative z-10">
        <button
          type="button"
          @click="activeTab = 'radar'"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'radar'
              ? 'bg-white text-emerald-900 shadow-md scale-102'
              : 'bg-white/15 text-white hover:bg-white/25'
          ]"
        >
          <Radar class="w-4 h-4 text-emerald-600" />
          <span>Escáner de Radar</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'requests'"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 relative cursor-pointer',
            activeTab === 'requests'
              ? 'bg-white text-emerald-900 shadow-md scale-102'
              : 'bg-white/15 text-white hover:bg-white/25'
          ]"
        >
          <Users class="w-4 h-4" />
          <span>Solicitudes de Amistad</span>
          <span
            v-if="friendRequests.length > 0"
            class="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold"
          >
            {{ friendRequests.length }}
          </span>
        </button>

        <button
          type="button"
          @click="activeTab = 'suggestions'"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'suggestions'
              ? 'bg-white text-emerald-900 shadow-md scale-102'
              : 'bg-white/15 text-white hover:bg-white/25'
          ]"
        >
          <UserPlus class="w-4 h-4" />
          <span>Sugerencias</span>
        </button>
      </div>
    </div>

    <!-- 1. Radar Scanner Screen -->
    <div v-if="activeTab === 'radar'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-7">
        <RadarScanner
          :users="nearbyUsers"
          :currentUser="currentUser"
          :range="radarRange"
          @select-user="selectUser"
          @update:range="setRadarRange"
        />
      </div>

      <div class="lg:col-span-5 space-y-4">
        <RadarUserCard
          :user="selectedUser"
          @close="selectUser(null)"
          @open-chat="openChat"
        />

        <!-- Detected users list -->
        <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 space-y-3">
          <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
            Usuarios cercanos detectados
          </h4>
          <div class="space-y-2">
            <div
              v-for="u in nearbyUsers"
              :key="u.id"
              @click="selectUser(u)"
              class="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <div class="relative">
                  <img
                    :src="u.avatar"
                    :alt="u.name"
                    class="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <span
                    v-if="u.isOnline"
                    class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
                  />
                </div>
                <div>
                  <h5 class="text-xs font-bold text-slate-900">{{ u.name }}</h5>
                  <span class="text-[11px] text-emerald-600 font-medium">
                    {{ u.radarDistance || 'Cerca de ti' }}
                  </span>
                </div>
              </div>

              <button
                type="button"
                @click.stop="openChat(u)"
                class="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Chatear"
              >
                <MessageCircle class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Friend Requests Screen -->
    <div v-else-if="activeTab === 'requests'" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90">
      <FriendRequestsList
        :requests="friendRequests"
        :acceptedList="acceptedRequests"
        @accept="acceptRequest"
        @decline="declineRequest"
      />
    </div>

    <!-- 3. Suggestions Screen -->
    <div v-else-if="activeTab === 'suggestions'" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
      <h3 class="font-bold text-slate-800 text-base">Personas que quizás conozcas</h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="u in nearbyUsers"
          :key="u.id"
          class="rounded-2xl border border-slate-200 overflow-hidden bg-white hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div class="relative h-20 bg-slate-100">
            <SafeImage :src="u.coverImage" alt="Cover" imgClass="w-full h-full object-cover" />
            <div class="absolute -bottom-5 left-4">
              <img
                :src="u.avatar"
                :alt="u.name"
                class="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
              />
            </div>
          </div>

          <div class="p-4 pt-7 flex-1">
            <h4 class="text-sm font-bold text-slate-900">{{ u.name }}</h4>
            <p class="text-xs text-slate-500">@{{ u.username }}</p>
            <p class="text-xs text-slate-600 line-clamp-2 mt-1.5">{{ u.bio }}</p>
          </div>

          <div class="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <button
              type="button"
              @click="addFriend(u.name)"
              class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <UserPlus class="w-3.5 h-3.5" />
              <span>Conectar</span>
            </button>
            <RouterLink
              :to="`/profiles/${u.id}`"
              class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Perfil
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { Radar, Users, UserPlus, MessageCircle } from 'lucide-vue-next';
import { useRadar } from '../composables/useRadar';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import RadarScanner from '../components/RadarScanner.vue';
import RadarUserCard from '../components/RadarUserCard.vue';
import FriendRequestsList from '../components/FriendRequestsList.vue';
import RadarLogo from '@/shared/components/RadarLogo.vue';
import SafeImage from '@/shared/components/SafeImage.vue';

const {
  nearbyUsers,
  friendRequests,
  acceptedRequests,
  radarRange,
  selectedUser,
  activeTab,
  currentUser,
  loadRadarData,
  setRadarRange,
  selectUser,
  acceptRequest,
  declineRequest,
} = useRadar();

const messengerStore = useMessengerStore();

onMounted(() => {
  loadRadarData();
});

function openChat(user) {
  messengerStore.openWithUser(user);
}

function addFriend(name) {
  alert(`¡Solicitud enviada a ${name}!`);
}
</script>
