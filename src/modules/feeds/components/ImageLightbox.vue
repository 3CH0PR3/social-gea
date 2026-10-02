<template>
  <div
    v-if="lightbox.isOpen && currentImage"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 select-none animate-in fade-in duration-200"
    @click="feedStore.closeLightbox"
  >
    <!-- Top Bar Controls -->
    <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
      <!-- Image Counter -->
      <div class="pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold border border-white/10 shadow-lg">
        <span class="text-emerald-400 font-bold">{{ lightbox.activeIndex + 1 }}</span>
        <span class="text-white/60">/</span>
        <span>{{ lightbox.images.length }}</span>
        <span v-if="lightbox.images.length > 1" class="text-[11px] text-white/60 hidden sm:inline ml-1 font-normal">
          (Usa ← y → para navegar)
        </span>
      </div>

      <!-- Actions (Open original & Close) -->
      <div class="pointer-events-auto flex items-center gap-2">
        <a
          :href="currentImage"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
          class="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
          title="Abrir imagen original"
        >
          <ExternalLink class="w-5 h-5" />
        </a>
        <button
          type="button"
          @click="feedStore.closeLightbox"
          class="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
          title="Cerrar (Esc)"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Previous Navigation Button (Flecha hacia atrás) -->
    <button
      v-if="lightbox.images.length > 1"
      type="button"
      @click.stop="feedStore.prevLightboxImage"
      class="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full bg-black/50 hover:bg-emerald-600 text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 focus:outline-none cursor-pointer border border-white/10"
      title="Foto anterior (Flecha izquierda ←)"
      aria-label="Foto anterior"
    >
      <ChevronLeft class="w-6 h-6 stroke-[2.5]" />
    </button>

    <!-- Next Navigation Button (Flecha hacia adelante) -->
    <button
      v-if="lightbox.images.length > 1"
      type="button"
      @click.stop="feedStore.nextLightboxImage"
      class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full bg-black/50 hover:bg-emerald-600 text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 focus:outline-none cursor-pointer border border-white/10"
      title="Siguiente foto (Flecha derecha →)"
      aria-label="Siguiente foto"
    >
      <ChevronRight class="w-6 h-6 stroke-[2.5]" />
    </button>

    <!-- Main Image Canvas Container -->
    <div
      class="relative max-w-5xl max-h-[80vh] flex items-center justify-center select-none"
      @click.stop
    >
      <SafeImage
        :src="currentImage"
        alt="Foto de publicación"
        imgClass="max-h-[75vh] max-w-[88vw] sm:max-w-[80vw] object-contain rounded-xl shadow-2xl transition-all duration-200"
        fallbackText="No se pudo cargar la imagen"
      />
    </div>

    <!-- Bottom Thumbnails Strip for Multiple Images -->
    <div
      v-if="lightbox.images.length > 1"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-2 bg-black/70 backdrop-blur-md rounded-2xl border border-white/15 max-w-[92vw] overflow-x-auto no-scrollbar shadow-2xl"
      @click.stop
    >
      <button
        v-for="(img, idx) in lightbox.images"
        :key="idx"
        type="button"
        @click="feedStore.setLightboxIndex(idx)"
        :class="[
          'relative w-14 h-14 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer border-2',
          lightbox.activeIndex === idx
            ? 'border-emerald-500 ring-2 ring-emerald-400 scale-105'
            : 'border-white/20 opacity-60 hover:opacity-100'
        ]"
        :title="`Ver imagen ${idx + 1}`"
      >
        <img
          :src="img"
          :alt="`Miniatura ${idx + 1}`"
          class="w-full h-full object-cover"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-vue-next';
import { useFeedStore } from '../store/feedStore';
import SafeImage from '@/shared/components/SafeImage.vue';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const feedStore = useFeedStore();

const lightbox = computed(() => feedStore.lightbox);
const currentImage = computed(() => feedStore.currentLightboxImage);

useBodyScrollLock(() => lightbox.value.isOpen);

function handleKeyDown(e) {
  if (!lightbox.value.isOpen) return;

  if (e.key === 'Escape') {
    feedStore.closeLightbox();
  } else if (e.key === 'ArrowRight') {
    feedStore.nextLightboxImage();
  } else if (e.key === 'ArrowLeft') {
    feedStore.prevLightboxImage();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
