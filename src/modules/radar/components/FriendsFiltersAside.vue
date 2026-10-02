<template>
  <aside class="w-full bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-6 select-none sticky top-20">
    <!-- Header of Sidebar -->
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
          <Filter class="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <h3 class="font-extrabold text-slate-900 text-sm tracking-tight">Filtros & Amigos</h3>
          <p class="text-[11px] text-slate-400">Colombia</p>
        </div>
      </div>

      <button
        v-if="radarStore.hasActiveFilters"
        type="button"
        @click="radarStore.resetFilters"
        class="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer hover:underline"
      >
        Limpiar
      </button>
    </div>

    <!-- Section Tabs in Aside -->
    <div class="space-y-1">
      <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2">
        Secciones
      </span>

      <button
        type="button"
        @click="radarStore.setActiveTab('friends')"
        :class="[
          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
          radarStore.activeTab === 'friends'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-700 hover:bg-slate-100/80'
        ]"
      >
        <div class="flex items-center gap-2.5">
          <Users class="w-4 h-4" />
          <span>Todos mis amigos</span>
        </div>
        <span
          :class="[
            'text-[10.5px] px-2 py-0.5 rounded-full font-bold',
            radarStore.activeTab === 'friends' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          ]"
        >
          {{ radarStore.friendsList.length }}
        </span>
      </button>

      <button
        type="button"
        @click="radarStore.setActiveTab('requests')"
        :class="[
          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
          radarStore.activeTab === 'requests'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-700 hover:bg-slate-100/80'
        ]"
      >
        <div class="flex items-center gap-2.5">
          <UserPlus class="w-4 h-4" />
          <span>Solicitudes</span>
        </div>
        <span
          :class="[
            'text-[10.5px] px-2 py-0.5 rounded-full font-bold',
            radarStore.pendingRequestsCount > 0
              ? 'bg-rose-500 text-white'
              : (radarStore.activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600')
          ]"
        >
          {{ radarStore.pendingRequestsCount }}
        </span>
      </button>

      <button
        type="button"
        @click="radarStore.setActiveTab('suggestions')"
        :class="[
          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
          radarStore.activeTab === 'suggestions'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-700 hover:bg-slate-100/80'
        ]"
      >
        <div class="flex items-center gap-2.5">
          <Sparkles class="w-4 h-4" />
          <span>Sugerencias</span>
        </div>
        <span
          :class="[
            'text-[10.5px] px-2 py-0.5 rounded-full font-bold',
            radarStore.activeTab === 'suggestions' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          ]"
        >
          {{ radarStore.suggestionsList.length }}
        </span>
      </button>
    </div>

    <!-- Live Search Input -->
    <div class="space-y-1.5 pt-2 border-t border-slate-100">
      <label class="text-[11px] font-bold text-slate-700 block px-1">
        Buscar por nombre o usuario
      </label>
      <div class="relative">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          :value="radarStore.searchQuery"
          @input="radarStore.setSearch($event.target.value)"
          placeholder="Ej: Valentina, Mateo..."
          class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-7 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-slate-400"
        />
        <button
          v-if="radarStore.searchQuery"
          type="button"
          @click="radarStore.setSearch('')"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- Filter 1: Departamento (Colombia) -->
    <div class="space-y-1.5">
      <label class="text-[11px] font-bold text-slate-700 flex items-center justify-between px-1">
        <span>Departamento</span>
        <span v-if="radarStore.selectedDepartment" class="text-emerald-700 text-[10px] font-medium">Activo</span>
      </label>
      <div class="relative">
        <select
          :value="radarStore.selectedDepartment"
          @change="radarStore.setDepartment($event.target.value)"
          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer appearance-none pr-8 font-medium"
        >
          <option value="">Todos los departamentos</option>
          <option
            v-for="dept in radarStore.departmentsList"
            :key="dept"
            :value="dept"
          >
            {{ dept }}
          </option>
        </select>
        <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>

    <!-- Filter 2: Municipio / Ciudad (Colombia) -->
    <div class="space-y-1.5">
      <label class="text-[11px] font-bold text-slate-700 flex items-center justify-between px-1">
        <span>Municipio / Ciudad</span>
        <span v-if="radarStore.selectedCity" class="text-emerald-700 text-[10px] font-medium">Activo</span>
      </label>
      <div class="relative">
        <select
          :value="radarStore.selectedCity"
          @change="radarStore.setCity($event.target.value)"
          :disabled="!radarStore.selectedDepartment"
          :class="[
            'w-full border rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all cursor-pointer appearance-none pr-8 font-medium',
            radarStore.selectedDepartment
              ? 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
          ]"
        >
          <option value="">
            {{ radarStore.selectedDepartment ? 'Todos los municipios' : 'Selecciona un departamento primero' }}
          </option>
          <option
            v-for="city in radarStore.availableCities"
            :key="city"
            :value="city"
          >
            {{ city }}
          </option>
        </select>
        <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>

    <!-- Filter 3: Área / Sector -->
    <div class="space-y-1.5">
      <label class="text-[11px] font-bold text-slate-700 flex items-center justify-between px-1">
        <span>Área / Sector</span>
        <span v-if="radarStore.selectedArea" class="text-emerald-700 text-[10px] font-medium">Activo</span>
      </label>
      <div class="relative">
        <select
          :value="radarStore.selectedArea"
          @change="radarStore.setArea($event.target.value)"
          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer appearance-none pr-8 font-medium"
        >
          <option value="">Todas las áreas</option>
          <option
            v-for="area in radarStore.areasList"
            :key="area"
            :value="area"
          >
            {{ area }}
          </option>
        </select>
        <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>

    <!-- Reset button on bottom if filtered -->
    <div v-if="radarStore.hasActiveFilters" class="pt-2">
      <button
        type="button"
        @click="radarStore.resetFilters"
        class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span>Restablecer filtros</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import {
  Filter,
  Users,
  UserPlus,
  Sparkles,
  Search,
  ChevronDown,
  X,
  RotateCcw
} from 'lucide-vue-next';
import { useRadarStore } from '../store/radarStore';

const radarStore = useRadarStore();
</script>
