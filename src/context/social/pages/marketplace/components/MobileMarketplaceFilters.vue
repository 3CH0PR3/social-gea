<template>
  <div class="bg-white rounded-md border border-slate-200 p-3.5 shadow-2xs space-y-3 lg:hidden select-none">
    <!-- User Points Mini Card on Mobile with matching button dimensions -->
    <div class="p-3 rounded-md bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between shadow-2xs">
      <div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Tus EcoPuntos</span>
        <span class="text-base font-black text-amber-800">{{ marketplaceStore.userPoints }} Pts</span>
      </div>
      <button
        type="button"
        @click="marketplaceStore.setPointsRange(marketplaceStore.selectedPointsRange === 'affordable' ? '' : 'affordable')"
        :class="[
          'px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer min-h-[32px] flex items-center justify-center',
          marketplaceStore.selectedPointsRange === 'affordable'
            ? 'bg-amber-700 text-white shadow-2xs'
            : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 shadow-2xs'
        ]"
      >
        {{ marketplaceStore.selectedPointsRange === 'affordable' ? '✓ Me alcanza' : 'Me alcanza' }}
      </button>
    </div>

    <!-- Live Search Bar on Mobile -->
    <div class="relative">
      <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        :value="marketplaceStore.searchQuery"
        @input="marketplaceStore.setSearch($event.target.value)"
        placeholder="Buscar planchas, neveras, bicis..."
        class="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-8 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-amber-600 focus:border-amber-600 placeholder-slate-400 font-medium"
      />
      <button
        v-if="marketplaceStore.searchQuery"
        type="button"
        @click="marketplaceStore.setSearch('')"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
        title="Limpiar búsqueda"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Horizontal Scrollable Categories Filter for Mobile -->
    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
      <button
        type="button"
        @click="marketplaceStore.setCategory('')"
        :class="[
          'px-3 py-1.5 rounded-md text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer',
          !marketplaceStore.selectedCategory
            ? 'bg-amber-700 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
        ]"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>Todos</span>
        <span
          :class="[
            'text-[10px] px-1.5 py-0.2 rounded font-bold',
            !marketplaceStore.selectedCategory ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          ]"
        >
          {{ marketplaceStore.items.length }}
        </span>
      </button>

      <button
        v-for="cat in marketplaceStore.categoriesList"
        :key="cat"
        type="button"
        @click="marketplaceStore.setCategory(cat)"
        :class="[
          'px-3 py-1.5 rounded-md text-xs font-bold shrink-0 transition-all cursor-pointer whitespace-nowrap',
          marketplaceStore.selectedCategory === cat
            ? 'bg-amber-700 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
        ]"
      >
        {{ cat }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { Search, X, Sparkles } from 'lucide-vue-next';
import { useMarketplaceStore } from '../store/marketplaceStore';

const marketplaceStore = useMarketplaceStore();
</script>
