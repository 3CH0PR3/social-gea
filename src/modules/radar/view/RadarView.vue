<template>
  <div class="w-full space-y-4 pb-12">
    <!-- Clean Top Title Header (Same flat structure as Empresas) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          {{ activeSectionTitle }}
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">
          {{ activeSectionDescription }}
        </p>
      </div>

      <!-- Mobile Search Box (visible only on mobile where the left sidebar is collapsed) -->
      <div class="lg:hidden relative w-full sm:w-64">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          :value="radarStore.searchQuery"
          @input="radarStore.setSearch($event.target.value)"
          placeholder="Buscar personas o ciudades..."
          class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none transition-all"
        />
      </div>
    </div>

    <!-- Mobile Filters Bar (visible only on mobile screens) -->
    <MobileFriendsFilters />

    <!-- Pure Cards Grid -->
    <div
      v-if="radarStore.filteredUsers.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
    >
      <FriendCard
        v-for="user in radarStore.filteredUsers"
        :key="user.id"
        :user="user"
      />
    </div>

    <!-- Clean Empty State if no cards match -->
    <div v-else class="bg-white rounded-xl p-10 text-center border border-slate-200 space-y-3">
      <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Users class="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 class="font-bold text-slate-800 text-sm">No se encontraron personas</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        No hay personas que coincidan con los filtros aplicados en esta sección.
      </p>
      <button
        v-if="radarStore.hasActiveFilters"
        type="button"
        @click="radarStore.resetFilters"
        class="px-3.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
      >
        Restablecer filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Users, Search } from 'lucide-vue-next';
import { useRadarStore } from '../store/radarStore';
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
      return 'Solicitudes de Amistad';
    case 'suggestions':
      return 'Personas sugeridas';
    default:
      return 'Amigos';
  }
});

const activeSectionDescription = computed(() => {
  switch (radarStore.activeTab) {
    case 'friends':
      return 'Personas con las que ya estás conectado en Conecta Radar';
    case 'requests':
      return 'Personas que te han enviado una solicitud para conectar';
    case 'suggestions':
      return 'Descubre y conecta con nuevas personas de tu ciudad o área';
    default:
      return '';
  }
});
</script>
