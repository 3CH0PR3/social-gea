<template>
  <div class="w-full space-y-4 pb-16 animate-in fade-in duration-200">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
          <Store class="w-6 h-6 text-emerald-600" />
          <span>Marketplace Verde</span>
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">
          Compra, vende y canjea artículos recuperados, compost y productos de economía circular
        </p>
      </div>

      <!-- Search Input -->
      <div class="relative w-full sm:w-64">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar artículos..."
          class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none transition-all"
        />
      </div>
    </div>

    <!-- Items Grid -->
    <div v-if="filteredItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 transition-colors overflow-hidden flex flex-col justify-between shadow-2xs select-none"
      >
        <!-- Item Photo -->
        <div class="relative h-44 w-full bg-slate-100 overflow-hidden">
          <SafeImage
            :src="item.image"
            :alt="item.title"
            containerClass="w-full h-full absolute inset-0"
            imgClass="w-full h-full object-cover"
            fallbackText="Producto"
          />
          <div class="absolute top-2 right-2 bg-emerald-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-md shadow-xs">
            {{ item.price }}
          </div>
          <div class="absolute top-2 left-2 bg-black/60 text-white font-medium text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
            <Coins class="w-3 h-3 text-amber-400" />
            <span>o {{ item.pointsPrice }}</span>
          </div>
        </div>

        <!-- Body -->
        <div class="p-3.5 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
              {{ item.category }}
            </span>
            <h3 class="font-bold text-slate-900 text-sm mt-1.5 leading-snug line-clamp-1">
              {{ item.title }}
            </h3>
            <p class="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {{ item.description }}
            </p>

            <div class="mt-2.5 flex items-center gap-1.5 text-[10.5px] text-slate-400">
              <MapPin class="w-3 h-3 text-slate-400 shrink-0" />
              <span class="truncate">{{ item.location }}</span>
            </div>
          </div>

          <!-- Seller & Action -->
          <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <img :src="item.seller.avatar" :alt="item.seller.name" class="w-6 h-6 rounded-full object-cover shrink-0" />
              <span class="text-[11px] font-semibold text-slate-700 truncate max-w-[110px]">
                {{ item.seller.name }}
              </span>
            </div>

            <button
              type="button"
              @click="contactSeller(item)"
              class="px-2.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
            >
              <MessageCircle class="w-3.5 h-3.5" />
              <span>Contactar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl p-10 text-center border border-slate-200 space-y-3">
      <Store class="w-10 h-10 text-slate-300 mx-auto" />
      <h3 class="font-bold text-slate-800 text-sm">No hay artículos que coincidan</h3>
      <p class="text-xs text-slate-500">
        Prueba buscando con otra palabra clave en el marketplace.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Store, Search, MessageCircle, MapPin, Coins } from 'lucide-vue-next';
import { MOCK_MARKETPLACE_ITEMS } from '../data/mockMarketplace';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import SafeImage from '@/shared/components/SafeImage.vue';

const messengerStore = useMessengerStore();
const searchQuery = ref('');
const items = ref([...MOCK_MARKETPLACE_ITEMS]);

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return items.value;
  const q = searchQuery.value.toLowerCase();
  return items.value.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
  );
});

function contactSeller(item) {
  messengerStore.openWithUser({
    id: `seller_${item.id}`,
    name: item.seller.name,
    avatar: item.seller.avatar,
    isOnline: true,
  });
}
</script>
