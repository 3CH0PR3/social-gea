<template>
  <div v-if="!src || hasError" :class="['flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 rounded-xl select-none min-h-[140px] border border-slate-200/80', containerClass]">
    <ImageOff class="w-8 h-8 mb-2 stroke-slate-400" />
    <span class="text-xs font-medium text-slate-500 text-center max-w-[200px] truncate">
      {{ fallbackText }}
    </span>
  </div>

  <div v-else :class="['relative overflow-hidden group', containerClass]">
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-slate-200 animate-pulse rounded-inherit"
    />
    <img
      :src="src"
      :alt="alt"
      referrerpolicy="no-referrer"
      loading="lazy"
      @load="isLoading = false"
      @error="onError"
      :class="[
        'transition-opacity duration-300',
        isLoading ? 'opacity-0' : 'opacity-100',
        imgClass
      ]"
    />
    <button
      v-if="allowZoom && !isLoading && !hasError"
      type="button"
      @click="$emit('zoom', src)"
      class="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-black/80"
      title="Ampliar imagen"
      aria-label="Ampliar imagen"
    >
      <ZoomIn class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ImageOff, ZoomIn } from 'lucide-vue-next';

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: 'Imagen',
  },
  fallbackText: {
    type: String,
    default: 'Imagen no disponible',
  },
  allowZoom: {
    type: Boolean,
    default: false,
  },
  imgClass: {
    type: String,
    default: '',
  },
  containerClass: {
    type: String,
    default: '',
  },
});

defineEmits(['zoom']);

const hasError = ref(false);
const isLoading = ref(true);

watch(() => props.src, () => {
  hasError.value = false;
  isLoading.value = true;
});

function onError() {
  isLoading.value = false;
  hasError.value = true;
}
</script>
