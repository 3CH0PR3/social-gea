<template>
  <section id="faq" class="sg-landing-section bg-white">
    <div class="sg-landing-container">
      <div class="sg-landing-section-header">
        <span class="sg-landing-section-badge">
          Preguntas Frecuentes & Transparencia
        </span>
        <h2 class="sg-landing-section-title">
          Todo lo que necesitas saber antes de registrarte
        </h2>
        <p class="sg-landing-section-sub">
          La economía circular solo funciona con reglas claras y total honestidad.
          Aquí resolvemos las dudas más comunes de nuestra comunidad en Colombia.
        </p>
      </div>

      <div class="max-w-5xl mx-auto space-y-3.5">
        <div
          v-for="(faq, idx) in faqs"
          :key="faq.q"
          class="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs"
        >
          <button
            type="button"
            @click="toggle(idx)"
            class="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-black text-base sm:text-lg text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>{{ faq.q }}</span>
            <ChevronDown
              :class="[
                'w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200',
                openIndex === idx ? 'rotate-180 text-emerald-800' : ''
              ]"
            />
          </button>

          <div
            v-if="openIndex === idx"
            class="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 text-sm sm:text-base text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

defineProps({
  faqs: {
    type: Array,
    required: true,
  },
});

const openIndex = ref(0);

function toggle(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx;
}
</script>
