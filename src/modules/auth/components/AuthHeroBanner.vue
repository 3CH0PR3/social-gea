<template>
  <div class="relative w-full h-full min-h-[480px] lg:min-h-screen overflow-hidden flex flex-col justify-end p-8 sm:p-10 lg:p-12 select-none bg-slate-950">
    <!-- Background Image -->
    <div
      v-for="(slide, idx) in slides"
      :key="slide.id"
      class="absolute inset-0 transition-opacity duration-300 ease-out"
      :class="idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
    >
      <img
        :src="slide.image"
        :alt="slide.titleHighlight"
        class="w-full h-full object-cover"
        loading="eager"
      />
      <!-- Bottom vignette gradient ensuring crisp high contrast -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      <div class="absolute inset-0 bg-black/25" />
    </div>

    <!-- Foreground Content Card (High Contrast & Balanced Sizing) -->
    <div class="relative z-20 max-w-lg space-y-3 sm:space-y-4">
      <!-- Floating Impact Badge -->
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span class="hero-badge-text">{{ activeSlide.statBadge }}</span>
      </div>

      <!-- Main Headline: Balanced text size (2xl to 4xl, not 6xl) with bright white and emerald colors -->
      <h1 class="hero-title text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight font-display">
        <span class="hero-white block">{{ activeSlide.titlePrefix }}</span>
        <span class="hero-white">{{ activeSlide.titleAction }}</span>
        <span class="hero-highlight ml-2">
          {{ activeSlide.titleHighlight }}
        </span>
      </h1>

      <!-- Description paragraph: Bright readable white-slate -->
      <p class="hero-desc text-xs sm:text-sm md:text-base leading-relaxed font-normal max-w-md">
        {{ activeSlide.description }}
      </p>

      <!-- Snappy Navigation Dots -->
      <div class="flex items-center gap-2 pt-2">
        <button
          v-for="(_, index) in slides"
          :key="index"
          type="button"
          @click="setSlide(index)"
          :class="[
            'h-2 rounded-full transition-all duration-200 cursor-pointer',
            index === currentSlideIndex
              ? 'w-7 bg-emerald-400'
              : 'w-2 bg-white/40 hover:bg-white/70'
          ]"
          :aria-label="`Ir a imagen ${index + 1}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useHeroSlider } from '../composables/useHeroSlider';

const { slides, currentSlideIndex, setSlide } = useHeroSlider();
const activeSlide = computed(() => slides[currentSlideIndex.value]);
</script>

<style scoped>
/* Overrides to ensure crystal-clear text colors over background image */
.hero-title,
.hero-white {
  color: #ffffff !important;
}

.hero-highlight {
  color: #34d399 !important;
  text-shadow: 0 2px 10px rgba(52, 211, 153, 0.4);
}

.hero-desc {
  color: #e2e8f0 !important;
}

.hero-badge-text {
  color: #6ee7b7 !important;
}
</style>
