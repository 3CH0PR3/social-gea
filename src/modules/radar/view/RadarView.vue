<template>
  <div class="w-full space-y-5 pb-12 animate-in fade-in duration-200">
    <!-- Top Modern Colombian Friends Hub Banner -->
    <div class="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-5 sm:p-6 text-white shadow-sm relative overflow-hidden">
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-2 border border-white/10">
          <span>🇨🇴</span>
          <span>Red de Amigos y Conexiones en Colombia</span>
        </div>
        <h1 class="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
          Amigos y Conexiones
        </h1>
        <p class="text-emerald-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
          Descubre amigos, gestiona solicitudes y conecta con personas por departamento, municipio y área de interés.
        </p>
      </div>
    </div>

    <!-- Mobile-First Direct Filters Bar (Android Friendly - NO hidden menus, NO drawers) -->
    <MobileFriendsFilters />

    <!-- Main Two-Column Layout for Web & Android Cards Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column on Web: Dedicated Colombian Aside Menu with Filters -->
      <div class="hidden lg:block lg:col-span-4 xl:col-span-3">
        <FriendsFiltersAside />
      </div>

      <!-- Right Column on Web / Main Stage: Cards Grid -->
      <div class="lg:col-span-8 xl:col-span-9 space-y-4">
        <!-- Stage Header & Active Filter Pills -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {{ activeSectionTitle }}
              </h2>
              <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {{ radarStore.filteredUsers.length }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              {{ activeSectionDescription }}
            </p>
          </div>

          <!-- Active Filter summary badges -->
          <div v-if="radarStore.hasActiveFilters" class="flex items-center gap-1.5 flex-wrap">
            <span
              v-if="radarStore.selectedDepartment"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              📍 {{ radarStore.selectedDepartment }}
              <button type="button" @click="radarStore.setDepartment('')" class="hover:text-emerald-950 cursor-pointer">
                <X class="w-3 h-3" />
              </button>
            </span>

            <span
              v-if="radarStore.selectedCity"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              🏙️ {{ radarStore.selectedCity }}
              <button type="button" @click="radarStore.setCity('')" class="hover:text-emerald-950 cursor-pointer">
                <X class="w-3 h-3" />
              </button>
            </span>

            <span
              v-if="radarStore.selectedArea"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              💼 {{ radarStore.selectedArea }}
              <button type="button" @click="radarStore.setArea('')" class="hover:text-emerald-950 cursor-pointer">
                <X class="w-3 h-3" />
              </button>
            </span>

            <button
              type="button"
              @click="radarStore.resetFilters"
              class="text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer ml-1"
            >
              Limpiar
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="radarStore.filteredUsers.length === 0"
          class="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-3 shadow-xs"
        >
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Users class="w-7 h-7" />
          </div>
          <h3 class="font-bold text-slate-800 text-base">
            No se encontraron personas
          </h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            No hay perfiles que coincidan con los filtros aplicados en esta sección.
          </p>
          <button
            v-if="radarStore.hasActiveFilters"
            type="button"
            @click="radarStore.resetFilters"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Restablecer todos los filtros</span>
          </button>
        </div>

        <!-- Cards Grid for Web & Android -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <FriendCard
            v-for="user in radarStore.filteredUsers"
            :key="user.id"
            :user="user"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Users, X, RotateCcw } from 'lucide-vue-next';
import { useRadarStore } from '../store/radarStore';
import FriendsFiltersAside from '../components/FriendsFiltersAside.vue';
import MobileFriendsFilters from '../components/MobileFriendsFilters.vue';
import FriendCard from '../components/FriendCard.vue';

const radarStore = useRadarStore();

onMounted(() => {
  radarStore.loadUsers();
});

const activeSectionTitle = computed(() => {
  switch (radarStore.activeTab) {
    case 'friends':
      return 'Mis Amigos';
    case 'requests':
      return 'Solicitudes de Amistad Recibidas';
    case 'suggestions':
      return 'Personas que quizá conozcas';
    default:
      return 'Amigos';
  }
});

const activeSectionDescription = computed(() => {
  switch (radarStore.activeTab) {
    case 'friends':
      return 'Personas con las que ya estás conectado en Conecta Radar.';
    case 'requests':
      return 'Personas que te han enviado una solicitud para conectar.';
    case 'suggestions':
      return 'Sugerencias basadas en tus conexiones, ciudad y área de interés.';
    default:
      return '';
  }
});
</script>
