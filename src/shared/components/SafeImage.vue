<template>
  <div v-if="!src || hasError" :class="['sg-safe-image-fallback', containerClass]">
    <ImageOff class="sg-safe-image-fallback__icon" />
    <span class="sg-safe-image-fallback__text">
      {{ fallbackText }}
    </span>
  </div>

  <div v-else :class="['sg-safe-image-wrapper', containerClass]">
    <div
      v-if="isLoading"
      class="sg-safe-image-skeleton"
    />
    <img
      :src="src"
      :alt="alt"
      referrerpolicy="no-referrer"
      loading="lazy"
      @load="isLoading = false"
      @error="onError"
      :class="[
        'sg-safe-image-img',
        isLoading ? 'sg-safe-image-img--loading' : 'sg-safe-image-img--loaded',
        imgClass
      ]"
    />
    <button
      v-if="allowZoom && !isLoading && !hasError"
      type="button"
      @click="$emit('zoom', src)"
      class="sg-safe-image-zoom-btn"
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
  containerClass: {
    type: String,
    default: '',
  },
  imgClass: {
    type: String,
    default: '',
  },
});

defineEmits(['zoom']);

const isLoading = ref(true);
const hasError = ref(false);

watch(
  () => props.src,
  () => {
    isLoading.value = true;
    hasError.value = false;
  }
);

function onError() {
  isLoading.value = false;
  hasError.value = true;
}
</script>
