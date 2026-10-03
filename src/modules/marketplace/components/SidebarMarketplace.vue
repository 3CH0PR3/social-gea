<template>
  <aside class="hidden lg:flex flex-col gap-3 w-68 shrink-0 sticky top-18 select-none pr-2">
    <!-- Back to Feed shortcut -->
    <RouterLink
      to="/feeds"
      class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
    >
      <ArrowLeft class="w-4 h-4 stroke-[2.2]" />
      <span>Volver al Feed principal</span>
    </RouterLink>

    <!-- Header Module Title -->
    <div class="px-2 pt-0.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Gift class="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 class="text-sm font-extrabold text-slate-900 leading-tight">Premios</h2>
            <span class="text-[11px] text-slate-500">Catálogo de Recompensas</span>
          </div>
        </div>

        <button
          v-if="marketplaceStore.hasActiveFilters"
          type="button"
          @click="marketplaceStore.resetFilters"
          class="text-[11px] text-amber-700 hover:text-amber-800 font-bold cursor-pointer hover:underline"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- User Points Mini Card in Sidebar with matching button dimensions -->
    <div class="mx-1 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 flex items-center justify-between shadow-2xs">
      <div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Tus EcoPuntos</span>
        <span class="text-base font-black text-amber-700">{{ marketplaceStore.userPoints }} Pts</span>
      </div>
      <button
        type="button"
        @click="marketplaceStore.setPointsRange(marketplaceStore.selectedPointsRange === 'affordable' ? '' : 'affordable')"
        :class="[
          'px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[32px] flex items-center justify-center',
          marketplaceStore.selectedPointsRange === 'affordable'
            ? 'bg-amber-600 text-white shadow-2xs'
            : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 shadow-2xs'
        ]"
      >
        {{ marketplaceStore.selectedPointsRange === 'affordable' ? '✓ Me alcanza' : 'Me alcanza' }}
      </button>
    </div>

    <!-- Search Input -->
    <div class="px-1">
      <div class="relative">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          :value="marketplaceStore.searchQuery"
          @input="marketplaceStore.setSearch($event.target.value)"
          placeholder="Buscar planchas, neveras, bicis..."
          class="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-400 shadow-2xs text-slate-800"
        />
        <button
          v-if="marketplaceStore.searchQuery"
          type="button"
          @click="marketplaceStore.setSearch('')"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
          title="Limpiar búsqueda"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- Categorías de Premios (Separated with space-y-1.5 and wider comfortable buttons) -->
    <div class="px-1 space-y-1.5 pt-1">
      <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-1 block">
        Categorías de Premios
      </span>

      <div class="space-y-1.5">
        <button
          type="button"
          @click="marketplaceStore.setCategory('')"
          :class="[
            'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left',
            !marketplaceStore.selectedCategory
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
          ]"
        >
          <div class="flex items-center gap-2">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Todos los premios</span>
          </div>
          <span :class="['text-[10px] px-1.5 py-0.2 rounded-full font-bold', !marketplaceStore.selectedCategory ? 'bg-white/20 text-white' : 'text-slate-500 bg-slate-100']">
            {{ marketplaceStore.items.length }}
          </span>
        </button>

        <button
          v-for="cat in marketplaceStore.categoriesList"
          :key="cat"
          type="button"
          @click="marketplaceStore.setCategory(cat)"
          :class="[
            'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left',
            marketplaceStore.selectedCategory === cat
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
          ]"
        >
          <span class="truncate">{{ cat }}</span>
        </button>
      </div>
    </div>

    <!-- Filter by Points Range -->
    <div class="px-1 space-y-2 pt-2 border-t border-slate-200/80">
      <div class="space-y-1">
        <label class="text-[11px] font-bold text-slate-700 block px-1">
          Rango de Puntos Requeridos
        </label>
        <div class="relative">
          <select
            :value="marketplaceStore.selectedPointsRange"
            @change="marketplaceStore.setPointsRange($event.target.value)"
            class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer appearance-none pr-8 font-medium shadow-2xs"
          >
            <option value="">Cualquier puntaje</option>
            <option value="affordable">Premios que me alcanzan (≤ {{ marketplaceStore.userPoints }} Pts)</option>
            <option value="low">Hasta 500 Pts (Planchas, termos, kits)</option>
            <option value="mid">500 a 1.000 Pts (Freidoras, smartwatches, monitores)</option>
            <option value="high">Más de 1.000 Pts (Neveras, bicicletas urbanas)</option>
          </select>
          <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Active Filters Reset Button -->
    <div v-if="marketplaceStore.hasActiveFilters" class="px-1 pt-1">
      <button
        type="button"
        @click="marketplaceStore.resetFilters"
        class="w-full py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <RotateCcw class="w-3 h-3" />
        <span>Restablecer filtros</span>
      </button>
    </div>

    <!-- Footer info -->
    <div class="mt-auto px-2 py-2 text-[11px] text-slate-400 space-y-0.5 border-t border-slate-200/80">
      <p class="font-medium text-slate-500 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-amber-500" />
        <span>Socialgea Rewards</span>
      </p>
      <p class="text-[10px] leading-tight">
        Entrega materiales clasificados en tu empresa de reciclaje para sumar puntos.
      </p>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import {
  ArrowLeft,
  Gift,
  Search,
  Sparkles,
  ChevronDown,
  X,
  RotateCcw
} from 'lucide-vue-next';
import { useMarketplaceStore } from '../store/marketplaceStore';

const marketplaceStore = useMarketplaceStore();
</script>
