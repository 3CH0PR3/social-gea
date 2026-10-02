<template>
  <div :class="['inline-flex items-center gap-2.5 select-none', customClass]">
    <div
      class="relative flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-sm transition-transform duration-200 hover:scale-105"
      :style="{
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
      }"
    >
      <div
        v-if="withRadarPulse"
        class="absolute inset-0 bg-emerald-400/20 rounded-2xl animate-ping pointer-events-none"
      />

      <svg
        viewBox="0 0 100 100"
        class="w-[78%] h-[78%]"
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

    <div v-if="showText" class="flex flex-col leading-tight">
      <div class="flex items-center gap-1.5">
        <span :class="['text-xl font-bold tracking-tight font-display', textColor]">
          Conecta
        </span>
        <span class="text-xs font-semibold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
          Radar
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 40,
  },
  showText: {
    type: Boolean,
    default: false,
  },
  withRadarPulse: {
    type: Boolean,
    default: false,
  },
  textColor: {
    type: String,
    default: 'text-slate-900',
  },
  customClass: {
    type: String,
    default: '',
  },
});
</script>
