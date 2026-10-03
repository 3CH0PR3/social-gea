<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { ArrowLeft, X } from 'lucide-vue-next';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, required: true },
  size: { type: String, default: 'md' }, // sm | md | lg | xl (ancho máximo en Desktop)
});
const emit = defineEmits(['update:modelValue', 'close']);

useBodyScrollLock(() => props.modelValue);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const onKey = (e) => {
  if (e.key === 'Escape' && props.modelValue) close();
};

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <Teleport to="body">
    <Transition name="sg-fade">
      <div
        v-if="modelValue"
        class="sg-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click.self="close"
      >
        <div class="sg-modal__panel" :class="`sg-modal--${size}`">
          <!-- Top App Bar for Android / Mobile (< 640px) -->
          <header class="sg-modal__appbar">
            <button type="button" class="sg-icon-btn" aria-label="Volver" @click="close">
              <ArrowLeft :size="20" />
            </button>
            <h2 class="sg-modal__title">{{ title }}</h2>
            <slot name="app-bar-actions" />
            <button type="button" class="sg-icon-btn" aria-label="Cerrar" @click="close">
              <X :size="20" />
            </button>
          </header>

          <!-- Standard Header for Desktop (>= 640px) -->
          <header class="sg-modal__header">
            <h2 class="sg-modal__title">{{ title }}</h2>
            <button type="button" class="sg-icon-btn" aria-label="Cerrar" @click="close">
              <X :size="18" />
            </button>
          </header>

          <!-- Body with unique scroll container -->
          <div class="sg-modal__body">
            <slot />
          </div>

          <!-- Fixed Bottom Footer (Safe-area on mobile, action bar on desktop) -->
          <footer v-if="$slots.actions" class="sg-modal__footer">
            <slot name="actions" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
