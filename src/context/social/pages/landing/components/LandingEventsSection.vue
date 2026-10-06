<template>
  <section id="eventos" class="sg-landing-section bg-slate-50/50">
    <div class="sg-landing-container">
      <div class="sg-landing-section-header">
        <span class="sg-landing-section-badge">
          Retos & Eventos Empresariales
        </span>
        <h2 class="sg-landing-section-title">
          Participa en eventos masivos y multiplica tus puntos 2X y 3X
        </h2>
        <p class="sg-landing-section-sub">
          Las empresas recicladoras organizan reciclatones barriales, torneos escolares y jornadas de acopio tecnológico.
          Al afiliarte a una empresa de tu municipio, tienes pase prioritario para acumular bonos relámpago.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="evt in events"
          :key="evt.id"
          class="sg-landing-card p-6 flex flex-col justify-between border-slate-200"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                {{ evt.category }}
              </span>
              <span class="text-xs sm:text-sm font-black text-amber-900 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                ⚡ {{ evt.multiplier }}
              </span>
            </div>

            <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {{ evt.title }}
            </h3>

            <p class="text-xs sm:text-sm text-slate-500 font-semibold mt-1.5">
              Organizado por: <strong class="text-slate-800">{{ evt.enterprise }}</strong>
            </p>

            <div class="mt-4 space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
              <div class="flex items-center gap-2">
                <Calendar class="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{{ evt.date }}</span>
              </div>
              <div class="flex items-center gap-2">
                <MapPin class="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{{ evt.location }} · <strong>{{ evt.city }}</strong></span>
              </div>
            </div>

            <div class="mt-4 p-3.5 bg-white rounded-md border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {{ evt.highlight }}
            </div>
          </div>

          <div class="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
            <span class="text-xs text-slate-500 font-semibold">
              Cupos limitados por jornada
            </span>
            <RouterLink
              to="/auth/register"
              class="sg-landing-btn sg-landing-btn--primary"
            >
              <span>Inscribirme con mi empresa</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Business sponsorship banner -->
      <div class="mt-10 p-5 sm:p-6 rounded-md bg-white border border-slate-200 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div>
          <h4 class="text-sm sm:text-base font-bold text-slate-900">
            ¿Representas a una empresa o centro de acopio en Colombia?
          </h4>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Conviértete en nodo oficial de Socialgea. Aumenta tu volumen de recolección en tu municipio y certifica tu huella circular.
          </p>
        </div>
        <RouterLink
          to="/auth/register"
          class="sg-landing-btn sg-landing-btn--secondary shrink-0 font-bold"
        >
          Registrar mi empresa
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { Calendar, MapPin } from 'lucide-vue-next';

defineProps({
  events: {
    type: Array,
    required: true,
  },
});
</script>
