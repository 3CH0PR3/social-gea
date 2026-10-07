<template>
  <div class="w-full space-y-4 pb-16 animate-in fade-in duration-200">
    <!-- Header Banner: EcoPuntos & Recycling Classification Business Logic -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
      <div>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold mb-1.5">
          <Gift class="w-3.5 h-3.5 text-amber-600" />
          <span>Canje & Recompensas por Reciclaje</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
          <span>Catálogo de Premios Socialgea</span>
        </h1>
        <p class="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
          Entrega y clasifica tus materiales (PET, cartón, vidrio, RAEE) en empresas recicladoras aliadas para acumular puntos y canjearlos por productos y electrodomésticos.
        </p>
      </div>

      <!-- EcoPuntos Balance Card with History trigger -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
        <div class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Coins class="w-5 h-5 text-white" />
          </div>
          <div>
            <span class="text-[9.5px] text-amber-100 font-semibold block uppercase tracking-wider">
              Tus EcoPuntos Acumulados
            </span>
            <span class="text-base sm:text-lg font-black text-white leading-tight">
              {{ marketplaceStore.userPoints }} Pts
            </span>
          </div>
        </div>

        <button
          type="button"
          @click="showClassificationInfo = !showClassificationInfo"
          class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs h-9 sm:h-auto"
          title="Ver cómo acumulaste tus puntos"
        >
          <History class="w-4 h-4 text-emerald-600" />
          <span class="text-xs">Historial</span>
        </button>
      </div>
    </div>

    <!-- Dropdown / Collapsible: User Recycling Classifications History -->
    <div
      v-if="showClassificationInfo"
      class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-in fade-in duration-150"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs font-bold text-emerald-950">
          <Sparkles class="w-4 h-4 text-emerald-600" />
          <span>Tus últimas entregas clasificadas de reciclaje</span>
        </div>
        <button
          type="button"
          @click="showClassificationInfo = false"
          class="text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div
          v-for="item in marketplaceStore.userClassifications"
          :key="item.id"
          class="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs space-y-1 text-xs"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-800">{{ item.material }}</span>
            <span class="text-[10px] text-slate-400">{{ item.date }}</span>
          </div>
          <p class="text-[11px] text-slate-500">
            Cantidad entregada: <strong class="text-slate-700">{{ item.amount }}</strong>
          </p>
          <div class="pt-1 flex items-center justify-between text-[11px]">
            <span class="text-slate-400 truncate max-w-[140px]">{{ item.enterprise }}</span>
            <span class="font-extrabold text-emerald-600">+{{ item.pointsEarned }} Pts</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filters Bar (visible only on mobile screens when left sidebar is hidden) -->
    <MobileMarketplaceFilters />

    <!-- Active Filters Feedback bar on mobile -->
    <div v-if="marketplaceStore.hasActiveFilters" class="flex items-center justify-between bg-amber-50/80 border border-amber-200 px-3.5 py-2 rounded-xl text-xs text-amber-900">
      <div class="flex items-center gap-1.5 truncate">
        <span class="font-bold">Filtrando por:</span>
        <span v-if="marketplaceStore.selectedCategory" class="bg-white px-2 py-0.5 rounded-md font-semibold border border-amber-200">
          {{ marketplaceStore.selectedCategory }}
        </span>
        <span v-if="marketplaceStore.selectedPointsRange" class="bg-white px-2 py-0.5 rounded-md font-semibold border border-amber-200">
          {{ marketplaceStore.selectedPointsRange === 'affordable' ? 'Me alcanza' : 'Rango de puntos' }}
        </span>
      </div>
      <button
        type="button"
        @click="marketplaceStore.resetFilters"
        class="text-amber-700 font-bold hover:underline shrink-0 text-xs cursor-pointer"
      >
        Limpiar
      </button>
    </div>

    <!-- Items Grid (Clicking card opens Amazon-style detail viewer) -->
    <div v-if="filteredItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 transition-colors overflow-hidden flex flex-col justify-between shadow-2xs select-none group cursor-pointer"
        @click="openProductDetail(item)"
      >
        <!-- Product Photo & Floating Badges -->
        <div class="relative h-48 w-full bg-slate-100 overflow-hidden">
          <SafeImage
            :src="item.image"
            :alt="item.title"
            containerClass="w-full h-full absolute inset-0"
            imgClass="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            fallbackText="Premio"
          />

          <!-- Value in COP -->
          <div class="absolute top-2.5 right-2.5 bg-slate-900/85 text-white font-bold text-xs px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-xs">
            {{ item.price }}
          </div>

          <!-- Cost in EcoPuntos -->
          <div class="absolute top-2.5 left-2.5 bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
            <Coins class="w-3.5 h-3.5 text-amber-100" />
            <span>{{ item.pointsPrice }}</span>
          </div>

          <!-- Recycling Equivalent pill at bottom of image -->
          <div class="absolute bottom-2 left-2 right-2 bg-black/65 backdrop-blur-xs text-white text-[10.5px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 truncate">
            <Sparkles class="w-3 h-3 text-emerald-400 shrink-0" />
            <span class="truncate">{{ item.recyclingEquivalent }}</span>
          </div>

          <!-- Quick view hint overlay on hover -->
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span class="px-2.5 py-1 rounded-lg bg-white/90 text-slate-800 text-[11px] font-bold shadow-xs">
              Ver fotos & detalles ↗
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 truncate">
                {{ item.category }}
              </span>
              <span class="text-[10px] text-slate-400 truncate">
                {{ item.partnerEnterprise }}
              </span>
            </div>

            <h3 class="font-bold text-slate-900 text-sm mt-1 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
              {{ item.title }}
            </h3>

            <p class="text-[11.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {{ item.description }}
            </p>
          </div>

          <!-- Delivery Mode & Action Button (Slightly more refined width and disabled when insufficient points) -->
          <div class="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2" @click.stop>
            <div class="min-w-0 flex-1 text-[10.5px] text-slate-400 flex items-center gap-1.5">
              <Truck class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span class="truncate">{{ item.deliveryInfo || 'Retiro en centro o envío' }}</span>
            </div>

            <!-- Canjear Button: Refined padding (px-3 py-1.5), disabled if insufficient points -->
            <button
              type="button"
              @click.stop="openRedeem(item)"
              :disabled="item.rawPoints > marketplaceStore.userPoints"
              :class="[
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0 min-h-[32px]',
                item.rawPoints > marketplaceStore.userPoints
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-90'
                  : 'bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-2xs cursor-pointer'
              ]"
              :title="item.rawPoints > marketplaceStore.userPoints ? `Te faltan ${item.rawPoints - marketplaceStore.userPoints} Pts para canjear este premio` : 'Canjear premio'"
            >
              <Lock v-if="item.rawPoints > marketplaceStore.userPoints" class="w-3.5 h-3.5 text-slate-400" />
              <Gift v-else class="w-3.5 h-3.5" />
              <span>{{ item.rawPoints > marketplaceStore.userPoints ? 'Faltan pts' : 'Canjear' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
      <Gift class="w-12 h-12 text-slate-300 mx-auto" />
      <h3 class="font-bold text-slate-800 text-sm">No hay premios que coincidan con tus filtros</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        Prueba cambiando la categoría o rango de puntos en el menú de la izquierda.
      </p>
      <button
        type="button"
        @click="marketplaceStore.resetFilters"
        class="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer mt-2"
      >
        Ver todos los premios
      </button>
    </div>

    <!-- 1. Amazon-Style Product Detail Modal (Shows 3 images gallery & full specs) -->
    <RewardDetailModal
      :isOpen="isDetailModalOpen"
      :reward="selectedRewardForDetail"
      @close="isDetailModalOpen = false"
      @start-redeem="handleStartRedeemFromDetail"
    />

    <!-- 2. Dedicated Redemption Process Modal UI -->
    <RedeemRewardModal
      :isOpen="isRedeemModalOpen"
      :reward="selectedRewardForRedeem"
      @close="isRedeemModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Gift, Coins, Sparkles, Truck, History, X, Lock } from 'lucide-vue-next';
import { useMarketplaceStore } from '../store/marketplaceStore';
import MobileMarketplaceFilters from '../components/MobileMarketplaceFilters.vue';
import RewardDetailModal from '../components/RewardDetailModal.vue';
import RedeemRewardModal from '../components/RedeemRewardModal.vue';
import SafeImage from '@/shared/components/SafeImage.vue';

const marketplaceStore = useMarketplaceStore();

const showClassificationInfo = ref(false);

// Detail Modal state (Amazon style)
const isDetailModalOpen = ref(false);
const selectedRewardForDetail = ref(null);

// Redemption Modal state
const isRedeemModalOpen = ref(false);
const selectedRewardForRedeem = ref(null);

const filteredItems = computed(() => marketplaceStore.filteredItems);

function openProductDetail(item) {
  selectedRewardForDetail.value = item;
  isDetailModalOpen.value = true;
}

function openRedeem(item) {
  if (item.rawPoints > marketplaceStore.userPoints) {
    return;
  }
  selectedRewardForRedeem.value = item;
  isRedeemModalOpen.value = true;
}

function handleStartRedeemFromDetail(item) {
  isDetailModalOpen.value = false;
  selectedRewardForRedeem.value = item;
  isRedeemModalOpen.value = true;
}
</script>
