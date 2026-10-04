<template>
  <aside class="hidden lg:flex flex-col gap-3.5 w-72 shrink-0 sticky top-20 select-none pr-2">
    <!-- Back to Feed shortcut -->
    <RouterLink
      to="/feeds"
      class="flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
    >
      <ArrowLeft class="w-4 h-4 stroke-[2.2]" />
      <span>Volver al Feed principal</span>
    </RouterLink>

    <!-- Header Module Title -->
    <div class="px-2 pt-0.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-md bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">Amigos</h2>
            <span class="text-xs text-slate-500">Conexiones & Red</span>
          </div>
        </div>

        <button
          v-if="radarStore.hasActiveFilters"
          type="button"
          @click="radarStore.resetFilters"
          class="text-xs text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer hover:underline"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Search Input -->
    <div class="px-2">
      <div class="relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          :value="radarStore.searchQuery"
          @input="radarStore.setSearch($event.target.value)"
          placeholder="Buscar por nombre o ciudad..."
          class="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-md bg-white border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all placeholder:text-slate-400 shadow-2xs text-slate-800"
        />
        <button
          v-if="radarStore.searchQuery"
          type="button"
          @click="radarStore.setSearch('')"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
          title="Limpiar búsqueda"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Section Navigation Tabs -->
    <div class="px-2 space-y-1.5">
      <span class="text-xs uppercase font-bold text-slate-400 tracking-wider px-1">
        Secciones
      </span>

      <button
        type="button"
        @click="radarStore.setActiveTab('friends')"
        :class="[
          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left',
          radarStore.activeTab === 'friends'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-700 hover:bg-slate-200/50'
        ]"
      >
        <div class="flex items-center gap-3">
          <Users class="w-4.5 h-4.5" />
          <span>Mis Amigos</span>
        </div>
        <span
          :class="[
            'text-xs px-2 py-0.5 rounded-full font-bold',
            radarStore.activeTab === 'friends' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          ]"
        >
          {{ radarStore.friendsList.length }}
        </span>
      </button>

      <button
        type="button"
        @click="radarStore.setActiveTab('requests')"
        :class="[
          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left',
          radarStore.activeTab === 'requests'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-700 hover:bg-slate-200/50'
        ]"
      >
        <div class="flex items-center gap-3">
          <UserPlus class="w-4.5 h-4.5" />
          <span>Solicitudes</span>
        </div>
        <span
          :class="[
            'text-xs px-2 py-0.5 rounded-full font-bold',
            radarStore.pendingRequestsCount > 0
              ? 'bg-rose-500 text-white'
              : (radarStore.activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700')
          ]"
        >
          {{ radarStore.pendingRequestsCount }}
        </span>
      </button>

      <button
        type="button"
        @click="radarStore.setActiveTab('suggestions')"
        :class="[
          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left',
          radarStore.activeTab === 'suggestions'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-700 hover:bg-slate-200/50'
        ]"
      >
        <div class="flex items-center gap-3">
          <Sparkles class="w-4.5 h-4.5" />
          <span>Sugerencias</span>
        </div>
        <span
          :class="[
            'text-xs px-2 py-0.5 rounded-full font-bold',
            radarStore.activeTab === 'suggestions' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          ]"
        >
          {{ radarStore.suggestionsList.length }}
        </span>
      </button>
    </div>

    <!-- Filters Section -->
    <div class="px-2 space-y-3 pt-2 border-t border-slate-200">
      <span class="text-xs uppercase font-bold text-slate-400 tracking-wider px-1">
        Filtros de Ubicación & Área
      </span>

      <!-- Departamento Dropdown -->
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-700 block px-1">
          Departamento (Colombia)
        </label>
        <div class="relative">
          <select
            :value="radarStore.selectedDepartment"
            @change="radarStore.setDepartment($event.target.value)"
            class="w-full bg-white border border-slate-200 rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all cursor-pointer appearance-none pr-8 font-medium shadow-2xs"
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
          <ChevronDown class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <!-- Municipio / Ciudad Dropdown -->
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-700 block px-1">
          Municipio / Ciudad
        </label>
        <div class="relative">
          <select
            :value="radarStore.selectedCity"
            @change="radarStore.setCity($event.target.value)"
            :disabled="!radarStore.selectedDepartment"
            :class="[
              'w-full border rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition-all appearance-none pr-8 font-medium shadow-2xs',
              radarStore.selectedDepartment
                ? 'bg-white border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 cursor-pointer'
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
          <ChevronDown class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <!-- Área / Sector Dropdown -->
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-700 block px-1">
          Área / Sector
        </label>
        <div class="relative">
          <select
            :value="radarStore.selectedArea"
            @change="radarStore.setArea($event.target.value)"
            class="w-full bg-white border border-slate-200 rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all cursor-pointer appearance-none pr-8 font-medium shadow-2xs"
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
          <ChevronDown class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <!-- Active Filter summary badges -->
      <div v-if="radarStore.hasActiveFilters" class="pt-2 space-y-2">
        <div class="flex flex-wrap gap-1.5">
          <span
            v-if="radarStore.selectedDepartment"
            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
          >
            📍 {{ radarStore.selectedDepartment }}
            <button type="button" @click="radarStore.setDepartment('')" class="hover:text-emerald-950 cursor-pointer">
              <X class="w-3.5 h-3.5" />
            </button>
          </span>

          <span
            v-if="radarStore.selectedCity"
            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
          >
            🏙️ {{ radarStore.selectedCity }}
            <button type="button" @click="radarStore.setCity('')" class="hover:text-emerald-950 cursor-pointer">
              <X class="w-3.5 h-3.5" />
            </button>
          </span>

          <span
            v-if="radarStore.selectedArea"
            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
          >
            💼 {{ radarStore.selectedArea }}
            <button type="button" @click="radarStore.setArea('')" class="hover:text-emerald-950 cursor-pointer">
              <X class="w-3.5 h-3.5" />
            </button>
          </span>
        </div>

        <button
          type="button"
          @click="radarStore.resetFilters"
          class="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw class="w-4 h-4" />
          <span>Restablecer filtros</span>
        </button>
      </div>
    </div>

    <!-- Hub Info Footer -->
    <div class="mt-auto px-3 py-3 text-xs text-slate-400 space-y-1 border-t border-slate-200">
      <p class="font-bold text-slate-600 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-500" />
        <span>Socialgea Colombia</span>
      </p>
      <p class="text-xs text-slate-400 leading-tight">
        Conéctate con amigos por departamento, municipio e intereses profesionales.
      </p>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import {
  ArrowLeft,
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
