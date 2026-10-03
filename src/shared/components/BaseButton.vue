<template>
  <button
    :type="type"
    :class="[
      'sg-btn',
      `sg-btn--${variant}`,
      size === 'sm' ? 'sg-btn--sm' : '',
      block ? 'sg-btn--block' : '',
      loading ? 'is-loading' : ''
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="animate-spin mr-1">⏳</span>
    <slot name="icon" />
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary', // primary | secondary | reward | danger | ghost
  },
  size: {
    type: String,
    default: 'md', // md | sm
  },
  type: {
    type: String,
    default: 'button',
  },
  block: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
