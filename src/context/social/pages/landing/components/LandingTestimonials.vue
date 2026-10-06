<template>
  <section class="sg-landing-section bg-slate-50/50">
    <div class="sg-landing-container">
      <div class="sg-landing-section-header">
        <span class="sg-landing-section-badge">
          Historias Reales en Colombia
        </span>
        <h2 class="sg-landing-section-title">
          Colombianos que ya estrenaron premios con su reciclaje
        </h2>
        <p class="sg-landing-section-sub">
          Familias, oficinas y estudiantes universitarios que dejaron de ver la basura como un desecho
          y hoy la aprovechan como una fuente continua de recompensas.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="item in testimonials"
          :key="item.id"
          class="sg-landing-card p-6 flex flex-col justify-between"
        >
          <div>
            <!-- User Header -->
            <div class="flex items-center gap-3.5 mb-4">
              <img
                :src="item.avatar"
                :alt="item.name"
                class="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-600/40 shrink-0"
              />
              <div class="min-w-0">
                <h4 class="text-base sm:text-lg font-black text-slate-900 truncate">
                  {{ item.name }}
                </h4>
                <span class="text-xs sm:text-sm text-slate-500 font-semibold block truncate">
                  {{ item.city }}
                </span>
                <span class="text-xs font-bold text-emerald-800 block">
                  {{ item.role }}
                </span>
              </div>
            </div>

            <!-- Quote -->
            <p class="text-sm sm:text-base text-slate-700 leading-relaxed italic">
              "{{ item.quote }}"
            </p>
          </div>

          <!-- Bottom Metric -->
          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
            <div>
              <span class="text-[11px] uppercase font-extrabold text-slate-400 block">Acumuló</span>
              <strong class="text-slate-900 font-black sg-landing-num text-sm sm:text-base">{{ item.pointsEarned }}</strong>
            </div>
            <div class="text-right">
              <span class="text-[11px] uppercase font-extrabold text-slate-400 block">Canjeó</span>
              <strong class="text-amber-800 font-black truncate max-w-[150px] block text-sm sm:text-base">{{ item.rewardReceived }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  testimonials: {
    type: Array,
    required: true,
  },
});
</script>
