<template>
  <div :class="['sg-logo', customClass]">
    <div
      class="sg-logo__icon"
      :style="{
        width: `${size}px`,
        height: `${size}px`,
      }"
    >
      <div
        v-if="withRadarPulse"
        class="sg-logo__pulse"
      />

      <svg
        viewBox="0 0 100 100"
        class="sg-logo__svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="42" stroke="white" stroke-opacity="0.15" stroke-width="1" stroke-dasharray="3 3" />
        <path
          d="M 64 24 A 36 36 0 1 0 64 76"
          stroke="white"
          stroke-width="7"
          stroke-linecap="round"
        />
        <path
          d="M 59 34 A 23 23 0 1 0 59 66"
          stroke="white"
          stroke-width="6.5"
          stroke-linecap="round"
        />
        <line x1="50" y1="50" x2="33" y2="33" stroke="white" stroke-width="6" stroke-linecap="round" />
        <line x1="50" y1="50" x2="66" y2="34" stroke="white" stroke-width="6" stroke-linecap="round" />
        <line x1="50" y1="50" x2="72" y2="50" stroke="white" stroke-width="6" stroke-linecap="round" />
        <line x1="50" y1="50" x2="33" y2="67" stroke="white" stroke-width="6" stroke-linecap="round" />
        <circle cx="50" cy="50" r="5.5" fill="white" />
        <circle cx="33" cy="33" r="6" fill="white" />
        <circle cx="66" cy="34" r="6" fill="white" />
        <circle cx="72" cy="50" r="6" fill="white" />
        <circle cx="33" cy="67" r="6" fill="white" />
        <circle cx="66" cy="66" r="6" fill="white" />
      </svg>
    </div>

    <div v-if="showText" class="sg-logo__text-wrap">
      <span :class="['sg-logo__text', textColor]">
        Socialgea
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 44,
  },
  showText: {
    type: Boolean,
    default: true,
  },
  textColor: {
    type: String,
    default: '',
  },
  withRadarPulse: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: '',
  },
});
</script>
