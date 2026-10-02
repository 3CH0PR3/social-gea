<template>
  <div class="bg-slate-950 rounded-3xl p-6 shadow-xl border border-emerald-900/30 flex flex-col items-center justify-center relative overflow-hidden min-h-[460px]">
    <!-- Range Indicator Bar -->
    <div class="w-full flex items-center justify-between text-xs text-emerald-400 mb-4 z-20 px-2">
      <span class="flex items-center gap-1.5 font-semibold">
        <Radar class="w-4 h-4 animate-spin text-emerald-400" style="animation-duration: 6s;" />
        Rango de detección
      </span>
      <span class="font-mono bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 text-emerald-300">
        {{ range >= 1000 ? `${(range / 1000).toFixed(1)} km` : `${range} m` }}
      </span>
    </div>

    <!-- Simulated Radar Circle Canvas -->
    <div class="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-full border-2 border-emerald-500/40 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)]">
      <!-- Concentric rings -->
      <div class="absolute inset-8 rounded-full border border-emerald-500/30" />
      <div class="absolute inset-20 rounded-full border border-emerald-500/20" />
      <div class="absolute inset-32 rounded-full border border-emerald-500/15" />

      <!-- Crosshair lines -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="w-full h-[1px] bg-emerald-500/25" />
        <div class="h-full w-[1px] bg-emerald-500/25 absolute" />
      </div>

      <!-- Sweeping radar sweep -->
      <div
        class="absolute inset-0 origin-center rounded-full pointer-events-none"
        style="background: conic-gradient(from 0deg at 50% 50%, rgba(16, 185, 129, 0.4) 0deg, rgba(16, 185, 129, 0) 65deg); animation: spin 4s linear infinite;"
      />

      <!-- Center User (You) -->
      <div class="relative z-20 flex flex-col items-center">
        <div class="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 to-teal-200 shadow-[0_0_15px_rgba(16,185,129,0.8)]">
          <img
            :src="currentUser.avatar"
            :alt="currentUser.name"
            class="w-full h-full rounded-full object-cover"
          />
        </div>
        <span class="text-[10px] font-bold text-emerald-300 mt-1 bg-black/60 px-1.5 py-0.2 rounded-full">
          Tú
        </span>
      </div>

      <!-- Blip 1: Elena (Top-Left) -->
      <button
        v-if="users[0]"
        type="button"
        @click="$emit('select-user', users[0])"
        class="absolute top-16 left-16 z-20 group focus:outline-none cursor-pointer"
        :title="`${users[0].name} (${users[0].radarDistance})`"
      >
        <div class="relative flex items-center justify-center">
          <span class="absolute w-8 h-8 rounded-full bg-emerald-400/40 animate-ping" />
          <div class="w-8 h-8 rounded-full p-0.5 bg-emerald-400 ring-2 ring-emerald-500/80 shadow-md">
            <img :src="users[0].avatar" :alt="users[0].name" class="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </button>

      <!-- Blip 2: Alejandro (Top-Right) -->
      <button
        v-if="users[1]"
        type="button"
        @click="$emit('select-user', users[1])"
        class="absolute top-20 right-16 z-20 group focus:outline-none cursor-pointer"
        :title="`${users[1].name} (${users[1].radarDistance})`"
      >
        <div class="relative flex items-center justify-center">
          <span class="absolute w-8 h-8 rounded-full bg-emerald-400/40 animate-ping" />
          <div class="w-8 h-8 rounded-full p-0.5 bg-emerald-400 ring-2 ring-emerald-500/80 shadow-md">
            <img :src="users[1].avatar" :alt="users[1].name" class="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </button>

      <!-- Blip 3: Sofía (Bottom-Left) -->
      <button
        v-if="users[2]"
        type="button"
        @click="$emit('select-user', users[2])"
        class="absolute bottom-16 left-20 z-20 group focus:outline-none cursor-pointer"
        :title="`${users[2].name} (${users[2].radarDistance})`"
      >
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full p-0.5 bg-teal-400 ring-2 ring-teal-500/80 shadow-md">
            <img :src="users[2].avatar" :alt="users[2].name" class="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </button>

      <!-- Blip 4: Valentina (Middle-Right) -->
      <button
        v-if="users[4]"
        type="button"
        @click="$emit('select-user', users[4])"
        class="absolute top-1/2 -translate-y-1/2 right-10 z-20 group focus:outline-none cursor-pointer"
        :title="`${users[4].name} (${users[4].radarDistance})`"
      >
        <div class="relative flex items-center justify-center">
          <span class="absolute w-10 h-10 rounded-full bg-emerald-400/50 animate-ping" />
          <div class="w-9 h-9 rounded-full p-0.5 bg-emerald-300 ring-2 ring-emerald-400 shadow-md">
            <img :src="users[4].avatar" :alt="users[4].name" class="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </button>
    </div>

    <!-- Range slider -->
    <div class="w-full max-w-xs mt-6 z-20">
      <input
        type="range"
        min="200"
        max="10000"
        step="100"
        :value="range"
        @input="$emit('update:range', Number($event.target.value))"
        class="w-full accent-emerald-500 cursor-pointer"
      />
      <div class="flex justify-between text-[11px] text-emerald-400/80 mt-1">
        <span>200m</span>
        <span>5 km</span>
        <span>10 km</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Radar } from 'lucide-vue-next';

defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  currentUser: {
    type: Object,
    required: true,
  },
  range: {
    type: Number,
    default: 2000,
  },
});

defineEmits(['select-user', 'update:range']);
</script>
