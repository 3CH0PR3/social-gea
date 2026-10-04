<template>
  <Teleport to="body">
    <div v-if="isOpen && reward">
      <!-- ========================================================
           1. ANDROID / MOBILE COMPONENT:
           Full-screen viewport (100dvh), native app screen with zero modal float or page scroll.
           ======================================================== -->
      <div
        v-if="!isDesktop"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col h-[100dvh] w-full overflow-hidden select-none animate-in slide-in-from-bottom duration-200"
      >
        <!-- Top App Bar (Back Arrow, Title, Close) -->
        <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 sticky top-0 z-20">
          <div class="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              @click="$emit('close')"
              class="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors cursor-pointer"
              aria-label="Volver"
            >
              <ArrowLeft class="w-5 h-5 stroke-[2.2]" />
            </button>
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900 truncate">
                Detalle del Premio
              </h3>
              <span class="text-[10px] text-amber-700 font-semibold block truncate">
                {{ reward.category }}
              </span>
            </div>
          </div>

          <button
            type="button"
            @click="$emit('close')"
            class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Mobile Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <!-- Main Product Image -->
          <div class="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
            <SafeImage
              :src="activeImageUrl"
              :alt="reward.title"
              imgClass="w-full h-full object-cover"
              containerClass="w-full h-full"
            />
            <div class="absolute top-2.5 left-2.5 bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
              <Coins class="w-3.5 h-3.5 text-amber-100" />
              <span>{{ reward.pointsPrice }}</span>
            </div>
            <div class="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-xs text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-xs">
              {{ reward.price }}
            </div>
          </div>

          <!-- 3 Thumbnail Buttons (Amazon gallery style) -->
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="(imgUrl, idx) in productImages"
              :key="idx"
              type="button"
              @click="activeImageIdx = idx"
              :class="[
                'relative h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-100',
                activeImageIdx === idx
                  ? 'border-amber-500 ring-2 ring-amber-400/50 scale-[1.02] shadow-xs'
                  : 'border-slate-200 opacity-75'
              ]"
            >
              <SafeImage
                :src="imgUrl"
                :alt="`Vista ${idx + 1}`"
                imgClass="w-full h-full object-cover"
                containerClass="w-full h-full"
              />
            </button>
          </div>

          <!-- Details & Description -->
          <div class="space-y-3 pt-1">
            <h2 class="text-base font-extrabold text-slate-900 leading-snug">
              {{ reward.title }}
            </h2>

            <p class="text-[11px] text-slate-500">
              Suministrado por: <strong class="text-slate-700">{{ reward.partnerEnterprise }}</strong>
            </p>

            <!-- Ecological Impact -->
            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5">
              <Sparkles class="w-4 h-4 text-emerald-600 shrink-0" />
              <div class="min-w-0">
                <span class="text-[9.5px] uppercase font-bold text-emerald-800 tracking-wider block">
                  Impacto Ecológico
                </span>
                <span class="text-xs font-bold text-emerald-950 block truncate">
                  {{ reward.recyclingEquivalent }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-1">
              <h4 class="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                Descripción:
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ reward.description }}
              </p>
            </div>

            <!-- Specs -->
            <div v-if="reward.specs && reward.specs.length > 0" class="space-y-1.5 pt-1">
              <h4 class="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                Especificaciones:
              </h4>
              <ul class="space-y-1">
                <li
                  v-for="(spec, i) in reward.specs"
                  :key="i"
                  class="text-xs text-slate-600 flex items-start gap-2"
                >
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{{ spec }}</span>
                </li>
              </ul>
            </div>

            <!-- Delivery info -->
            <div class="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <Truck class="w-4 h-4 text-slate-400 shrink-0" />
              <span>{{ reward.deliveryInfo }}</span>
            </div>
          </div>
        </div>

        <!-- Android Bottom Action Bar -->
        <div class="p-3 border-t border-slate-200 bg-white shrink-0 space-y-2">
          <div class="flex items-center justify-between text-xs px-1">
            <span class="text-slate-500">Tus EcoPuntos:</span>
            <span class="font-bold text-slate-900">{{ marketplaceStore.userPoints }} Pts</span>
          </div>

          <button
            type="button"
            @click="handleStartRedeem"
            :disabled="!canAfford"
            :class="[
              'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs min-h-[38px]',
              canAfford
                ? 'bg-amber-500 hover:bg-amber-600 active:scale-98 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
            ]"
          >
            <Lock v-if="!canAfford" class="w-4 h-4 text-slate-400" />
            <Gift v-else class="w-4 h-4" />
            <span>
              {{ canAfford ? `Canjear este premio (${reward.rawPoints} Pts)` : `Puntos insuficientes (${reward.rawPoints} Pts)` }}
            </span>
          </button>
        </div>
      </div>

      <!-- ========================================================
           2. DESKTOP MODAL:
           Clean floating modal dialog centered in the viewport.
           ======================================================== -->
      <div
        v-else
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        @click="$emit('close')"
      >
        <div
          class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
          @click.stop
        >
          <!-- Desktop Modal Top Bar -->
          <div class="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md truncate">
                {{ reward.category }}
              </span>
              <span class="text-[11px] text-slate-400">·</span>
              <span class="text-[11px] text-slate-500 font-medium truncate">
                {{ reward.partnerEnterprise }}
              </span>
            </div>

            <button
              type="button"
              @click="$emit('close')"
              class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
              aria-label="Cerrar"
            >
              <X class="w-4.5 h-4.5" />
            </button>
          </div>

          <!-- Desktop Amazon-Style Body -->
          <div class="p-6 overflow-y-auto flex-1">
            <div class="grid grid-cols-2 gap-6 items-start">
              <!-- Left: Gallery -->
              <div class="space-y-3">
                <div class="relative h-72 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                  <SafeImage
                    :src="activeImageUrl"
                    :alt="reward.title"
                    imgClass="w-full h-full object-cover transition-all duration-300"
                    containerClass="w-full h-full"
                  />
                  <div class="absolute top-2.5 left-2.5 bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                    <Coins class="w-3.5 h-3.5 text-amber-100" />
                    <span>{{ reward.pointsPrice }}</span>
                  </div>
                  <div class="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-xs text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-xs">
                    {{ reward.price }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-2.5">
                  <button
                    v-for="(imgUrl, idx) in productImages"
                    :key="idx"
                    type="button"
                    @click="activeImageIdx = idx"
                    :class="[
                      'relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-100',
                      activeImageIdx === idx
                        ? 'border-amber-500 ring-2 ring-amber-400/50 scale-[1.02] shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                    ]"
                  >
                    <SafeImage
                      :src="imgUrl"
                      :alt="`Vista ${idx + 1}`"
                      imgClass="w-full h-full object-cover"
                      containerClass="w-full h-full"
                    />
                  </button>
                </div>

                <p class="text-[10.5px] text-center text-slate-400">
                  Toca cada imagen para ver diferentes ángulos del producto
                </p>
              </div>

              <!-- Right: Info -->
              <div class="space-y-4 flex flex-col justify-between">
                <div>
                  <h2 class="text-lg font-extrabold text-slate-900 leading-snug tracking-tight">
                    {{ reward.title }}
                  </h2>
                  <p class="text-[11px] text-slate-500 mt-1">
                    Suministrado por: <strong class="text-slate-700">{{ reward.partnerEnterprise }}</strong>
                  </p>

                  <div class="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles class="w-4 h-4" />
                    </div>
                    <div class="min-w-0">
                      <span class="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                        Impacto Ecológico Directo
                      </span>
                      <span class="text-xs font-bold text-emerald-950 block truncate">
                        {{ reward.recyclingEquivalent }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-3.5 space-y-1">
                    <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      Descripción:
                    </h4>
                    <p class="text-xs text-slate-600 leading-relaxed">
                      {{ reward.description }}
                    </p>
                  </div>

                  <div v-if="reward.specs && reward.specs.length > 0" class="mt-3.5 space-y-1.5">
                    <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      Especificaciones:
                    </h4>
                    <ul class="space-y-1">
                      <li
                        v-for="(spec, i) in reward.specs"
                        :key="i"
                        class="text-xs text-slate-600 flex items-start gap-2"
                      >
                        <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{{ spec }}</span>
                      </li>
                    </ul>
                  </div>

                  <div class="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                    <Truck class="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{{ reward.deliveryInfo }}</span>
                  </div>
                </div>

                <!-- Bottom Action -->
                <div class="pt-4 border-t border-slate-200 space-y-2.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500">Tus EcoPuntos:</span>
                    <span class="font-bold text-slate-900">{{ marketplaceStore.userPoints }} Pts</span>
                  </div>

                  <button
                    type="button"
                    @click="handleStartRedeem"
                    :disabled="!canAfford"
                    :class="[
                      'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs min-h-[38px]',
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-600 active:scale-98 text-white cursor-pointer'
                        : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                    ]"
                  >
                    <Lock v-if="!canAfford" class="w-4 h-4 text-slate-400" />
                    <Gift v-else class="w-4 h-4" />
                    <span>
                      {{ canAfford ? `Canjear este premio (${reward.rawPoints} Pts)` : `Puntos insuficientes (${reward.rawPoints} Pts)` }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import {
  X,
  ArrowLeft,
  Gift,
  Coins,
  Sparkles,
  CheckCircle2,
  Truck,
  Lock
} from 'lucide-vue-next';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  reward: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'start-redeem']);
const marketplaceStore = useMarketplaceStore();

const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 640 : true);

function handleResize() {
  isDesktop.value = window.innerWidth >= 640;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

useBodyScrollLock(() => props.isOpen);

const activeImageIdx = ref(0);

watch(
  () => props.reward,
  () => {
    activeImageIdx.value = 0;
  }
);

const productImages = computed(() => {
  if (!props.reward) return [];
  if (Array.isArray(props.reward.images) && props.reward.images.length > 0) {
    return props.reward.images.slice(0, 3);
  }
  return [props.reward.image, props.reward.image, props.reward.image];
});

const activeImageUrl = computed(() => {
  return productImages.value[activeImageIdx.value] || props.reward?.image || '';
});

const canAfford = computed(() => {
  if (!props.reward) return false;
  return marketplaceStore.userPoints >= props.reward.rawPoints;
});

function handleStartRedeem() {
  if (!canAfford.value) return;
  emit('start-redeem', props.reward);
}
</script>
