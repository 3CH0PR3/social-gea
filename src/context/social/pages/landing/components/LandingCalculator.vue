<template>
  <section id="simulador" class="sg-landing-section bg-white">
    <div class="sg-landing-container">
      <div class="sg-landing-section-header">
        <span class="sg-landing-section-badge">
          Simulador Interactivo de Ganancias
        </span>
        <h2 class="sg-landing-section-title">
          Calcula cuánto dinero y premios tienes acumulados en tu hogar
        </h2>
        <p class="sg-landing-section-sub">
          Ajusta los kilos aproximados que tu familia genera al mes. Descubre en tiempo real cuántos
          EcoPuntos acumulas y qué productos de nuestro catálogo puedes canjear.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Controls Side (Left - 7 cols) -->
        <div class="lg:col-span-7 space-y-3.5">
          <div
            v-for="mat in materials"
            :key="mat.id"
            class="p-3.5 sm:p-4 rounded-md border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2.5 sm:gap-3">
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center text-emerald-800 font-extrabold text-xs sm:text-sm shadow-2xs shrink-0">
                  {{ mat.pointsPerKg }}p
                </div>
                <div>
                  <h4 class="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    {{ mat.name }}
                  </h4>
                  <span class="text-xs text-slate-500 font-medium">
                    {{ mat.example }}
                  </span>
                </div>
              </div>

              <div class="text-right shrink-0">
                <span class="text-sm sm:text-base font-bold text-slate-900 sg-landing-num">
                  {{ weights[mat.id] }} kg / mes
                </span>
                <span class="block text-xs font-bold text-emerald-800">
                  +{{ weights[mat.id] * mat.pointsPerKg }} Pts
                </span>
              </div>
            </div>

            <!-- Slider control -->
            <div class="flex items-center gap-3 pt-1">
              <input
                type="range"
                v-model.number="weights[mat.id]"
                :min="0"
                :max="mat.id === 'raee' ? 25 : 80"
                :step="mat.id === 'raee' ? 1 : 2"
                class="sg-landing-range-input"
              />
            </div>
          </div>
        </div>

        <!-- Real-time Projection Card (Right - 5 cols) -->
        <div class="lg:col-span-5">
          <div class="sticky top-24 p-5 sm:p-6 rounded-md border border-emerald-600/30 bg-gradient-to-b from-emerald-50/30 via-white to-white shadow-2xs space-y-5">
            <div class="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Proyección mensual estimada
                </span>
                <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 sg-landing-num mt-0.5">
                  {{ monthlyPoints }}
                  <span class="text-xs sm:text-sm font-bold text-emerald-700">EcoPuntos</span>
                </h3>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold text-slate-500 block">Equivalencia en COP</span>
                <span class="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 sg-landing-num">
                  $ {{ formatCop(estimatedCop) }}
                </span>
              </div>
            </div>

            <!-- Annual Accumulation -->
            <div class="p-3.5 rounded-md bg-white border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
              <span class="text-slate-700 font-semibold">Acumulación en 1 año (12 meses):</span>
              <strong class="font-bold text-slate-900 sg-landing-num text-xs sm:text-sm">
                {{ monthlyPoints * 12 }} Pts (~$ {{ formatCop(estimatedCop * 12) }} COP)
              </strong>
            </div>

            <!-- Recommended Rewards you can claim -->
            <div class="space-y-2.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles class="w-4 h-4 text-amber-600" />
                Premios a tu alcance con este ritmo:
              </h4>

              <div class="space-y-2">
                <div
                  v-for="rew in unlockedRewards"
                  :key="rew.title"
                  class="p-3 rounded-md border border-slate-200 bg-white flex items-center gap-3"
                >
                  <img
                    :src="rew.image"
                    :alt="rew.title"
                    class="w-12 h-12 rounded-md object-cover border border-slate-100 shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <h5 class="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {{ rew.title }}
                    </h5>
                    <span class="text-xs text-slate-500 font-semibold block mt-0.5">
                      Costo: <strong class="text-amber-800">{{ rew.points }} Pts</strong> · {{ rew.timeToReach }}
                    </span>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 shrink-0">
                    Alcanzable
                  </span>
                </div>
              </div>
            </div>

            <!-- Conversion CTA -->
            <div class="pt-1">
              <RouterLink
                to="/auth/register"
                class="sg-landing-btn sg-landing-btn--reward sg-landing-btn--block"
              >
                <span>Empezar a ganar estos puntos</span>
                <ArrowRight class="w-4 h-4" />
              </RouterLink>
              <p class="text-xs text-slate-500 text-center mt-2 font-medium">
                Registro gratis en 30 segundos · Sin contratos ni letras pequeñas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Sparkles, ArrowRight } from 'lucide-vue-next';

const props = defineProps({
  materials: {
    type: Array,
    required: true,
  },
});

const weights = reactive({
  pet: 16,
  carton: 24,
  raee: 3,
  aluminio: 6,
  vidrio: 18,
});

const monthlyPoints = computed(() => {
  return props.materials.reduce((total, mat) => {
    const w = weights[mat.id] || 0;
    return total + (w * mat.pointsPerKg);
  }, 0);
});

const estimatedCop = computed(() => {
  // Approximate standard: 1 EcoPunto = ~150 COP value in catalogue items
  return monthlyPoints.value * 150;
});

function formatCop(val) {
  return new Intl.NumberFormat('es-CO').format(Math.round(val));
}

const unlockedRewards = computed(() => {
  const pts = monthlyPoints.value;
  const list = [];

  if (pts >= 250) {
    list.push({
      title: 'Botella Térmica Acero Inox 750ml',
      points: 290,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=150&q=80',
      timeToReach: 'Canjeable en mes 1',
    });
  }
  if (pts >= 400) {
    list.push({
      title: 'Plancha Cerámica Iónica Profesional',
      points: 480,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80',
      timeToReach: 'Canjeable en 1-2 meses',
    });
  }
  if (pts >= 600 || list.length < 3) {
    list.push({
      title: 'Freidora de Aire Digital 4.5L',
      points: 850,
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=150&q=80',
      timeToReach: 'Canjeable en ~2 meses',
    });
  }

  return list;
});
</script>
