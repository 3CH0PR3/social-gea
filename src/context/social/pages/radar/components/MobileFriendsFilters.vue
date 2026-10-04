<template>
  <div class="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs space-y-3 lg:hidden select-none">
    <!-- 1. Live Search Bar on Mobile -->
    <div class="relative">
      <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        :value="radarStore.searchQuery"
        @input="radarStore.setSearch($event.target.value)"
        placeholder="Buscar amigos por nombre o ciudad..."
        class="w-full bg-slate-100/80 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-400"
      />
      <button
        v-if="radarStore.searchQuery"
        type="button"
        @click="radarStore.setSearch('')"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- 2. Horizontal Scrollable Section Tabs for Android -->
    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
      <button
        type="button"
        @click="radarStore.setActiveTab('friends')"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer',
          radarStore.activeTab === 'friends'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
        ]"
      >
        <Users class="w-3.5 h-3.5" />
        <span>Mis Amigos</span>
        <span
          :class="[
            'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
            radarStore.activeTab === 'friends' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
          ]"
        >
          {{ radarStore.friendsList.length }}
        </span>
      </button>

      <button
        type="button"
        @click="radarStore.setActiveTab('requests')"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer relative',
          radarStore.activeTab === 'requests'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
        ]"
      >
        <UserPlus class="w-3.5 h-3.5" />
        <span>Solicitudes</span>
        <span
          v-if="radarStore.pendingRequestsCount > 0"
          class="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9.5px] font-bold"
        >
          {{ radarStore.pendingRequestsCount }}
        </span>
      </button>

      <button
        type="button"
        @click="radarStore.setActiveTab('suggestions')"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer',
          radarStore.activeTab === 'suggestions'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
        ]"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>Sugerencias</span>
        <span
          :class="[
            'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
            radarStore.activeTab === 'suggestions' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
          ]"
        >
          {{ radarStore.suggestionsList.length }}
        </span>
      </button>
    </div>

    <!-- 3. Direct Filters Row in Android (Accessible directly without opening menus!) -->
    <div class="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-100">
      <!-- Departamento Dropdown -->
      <div class="relative">
        <select
          :value="radarStore.selectedDepartment"
          @change="radarStore.setDepartment($event.target.value)"
          :class="[
            'w-full text-[11px] font-semibold py-1.5 pl-2 pr-6 rounded-xl border appearance-none outline-none truncate',
            radarStore.selectedDepartment
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          ]"
        >
          <option value="">📍 Dpto</option>
          <option
            v-for="dept in radarStore.departmentsList"
            :key="dept"
            :value="dept"
          >
            {{ dept }}
          </option>
        </select>
        <ChevronDown class="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <!-- Municipio Dropdown -->
      <div class="relative">
        <select
          :value="radarStore.selectedCity"
          @change="radarStore.setCity($event.target.value)"
          :disabled="!radarStore.selectedDepartment"
          :class="[
            'w-full text-[11px] font-semibold py-1.5 pl-2 pr-6 rounded-xl border appearance-none outline-none truncate',
            radarStore.selectedCity
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : (radarStore.selectedDepartment ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-100 border-slate-200 text-slate-400')
          ]"
        >
          <option value="">🏙️ Ciudad</option>
          <option
            v-for="city in radarStore.availableCities"
            :key="city"
            :value="city"
          >
            {{ city }}
          </option>
        </select>
        <ChevronDown class="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <!-- Área Dropdown -->
      <div class="relative">
        <select
          :value="radarStore.selectedArea"
          @change="radarStore.setArea($event.target.value)"
          :class="[
            'w-full text-[11px] font-semibold py-1.5 pl-2 pr-6 rounded-xl border appearance-none outline-none truncate',
            radarStore.selectedArea
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          ]"
        >
          <option value="">💼 Área</option>
          <option
            v-for="area in radarStore.areasList"
            :key="area"
            :value="area"
          >
            {{ area }}
          </option>
        </select>
        <ChevronDown class="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>

    <!-- Active Filters Reset Badge for Mobile -->
    <div v-if="radarStore.hasActiveFilters" class="flex items-center justify-between text-xs pt-1 px-1">
      <span class="text-slate-500 text-[11px]">
        Mostrando {{ radarStore.filteredUsers.length }} resultados
      </span>
      <button
        type="button"
        @click="radarStore.resetFilters"
        class="text-emerald-700 hover:text-emerald-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
      >
        <RotateCcw class="w-3 h-3" />
        <span>Limpiar filtros</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  Search,
  X,
  Users,
  UserPlus,
  Sparkles,
  ChevronDown,
  RotateCcw
} from 'lucide-vue-next';
import { useRadarStore } from '../store/radarStore';

const radarStore = useRadarStore();
</script>
