<template>
  <section class="sg-landing-hero">
    <div class="sg-landing-container">
      <div class="sg-landing-hero__grid">
        <!-- Hero Copy (Left) -->
        <div>
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs sm:text-sm font-bold mb-5 shadow-2xs">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Red Social Oficial de Reciclaje · Colombia 2026</span>
          </div>

          <!-- Main Title -->
          <h1 class="sg-landing-hero__title">
            Tu reciclaje en casa vale
            <span class="sg-landing-hero__highlight">premios reales</span>
            para tu hogar.
          </h1>

          <!-- Lead Paragraph -->
          <p class="sg-landing-hero__lead">
            Únete a la primera red social comunitaria donde separar PET, cartón, RAEE y vidrio te acredita
            <strong class="text-emerald-800 font-bold">EcoPuntos</strong> verificados por empresas recicladoras de tu municipio.
            Canjéalos sin costo por freidoras de aire, neveras, bicicletas y herramientas de tecnología.
          </p>

          <!-- Dual CTAs (Standard Buttons, Zero Animation) -->
          <div class="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <RouterLink
              to="/auth/register"
              class="sg-landing-btn sg-landing-btn--primary"
            >
              <CheckCircle class="w-4 h-4" />
              <span>Crear mi cuenta gratuita</span>
            </RouterLink>

            <a
              href="#simulador"
              class="sg-landing-btn sg-landing-btn--secondary"
            >
              <Calculator class="w-4 h-4 text-emerald-700" />
              <span>Calcular mis puntos</span>
            </a>
          </div>

          <!-- Trust Badges -->
          <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
            <div class="flex items-center gap-1.5">
              <ShieldCheck class="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Pesaje verificado en báscula</span>
            </div>
            <div class="flex items-center gap-1.5">
              <MapPin class="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Empresas en tu municipio</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Gift class="w-4 h-4 text-amber-700 shrink-0" />
              <span>Premios con entrega nacional</span>
            </div>
          </div>

          <!-- Stats Bar -->
          <div class="sg-landing-stats">
            <div>
              <div class="sg-landing-stat__num">{{ stats.usersCount }}</div>
              <div class="sg-landing-stat__label">Colombianos conectados</div>
            </div>
            <div>
              <div class="sg-landing-stat__num">{{ stats.tonnesRecycled }} Ton</div>
              <div class="sg-landing-stat__label">Material recuperado</div>
            </div>
            <div>
              <div class="sg-landing-stat__num whitespace-nowrap">
                $ 234.5M <span class="text-xs sm:text-sm font-extrabold text-slate-500 uppercase">COP</span>
              </div>
              <div class="sg-landing-stat__label">Entregado en premios</div>
            </div>
            <div>
              <div class="sg-landing-stat__num">{{ stats.alliedCompanies }}</div>
              <div class="sg-landing-stat__label">Empresas aliadas</div>
            </div>
          </div>
        </div>

        <!-- Hero Graphic: Live Simulated Ticket (Right) -->
        <div class="relative">
          <div class="sg-landing-ticket-card">
            <!-- Simulated User Status -->
            <div class="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-emerald-600/40 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                    alt="Usuario verificado"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="min-w-0">
                  <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">Carolina Morales (Bogotá)</h4>
                  <span class="text-[11px] text-emerald-800 font-bold block mt-0.5">● Afiliada a Recicladora Metropolitana</span>
                </div>
              </div>
              <span class="text-[11px] font-extrabold px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-md shrink-0">
                Reciclador Oro
              </span>
            </div>

            <!-- Points Balance Spotlight -->
            <div class="p-3.5 sm:p-4 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block">
                  Saldo disponible
                </span>
                <span class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 sg-landing-num">
                  1.420 <span class="text-xs sm:text-sm font-bold text-emerald-700">EcoPuntos</span>
                </span>
              </div>
              <div class="text-right">
                <span class="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block">
                  Equivalente comercial
                </span>
                <span class="text-base sm:text-lg lg:text-xl font-black text-slate-800 sg-landing-num">
                  $ 213.000 COP
                </span>
              </div>
            </div>

            <!-- Recent Weighing Ticket -->
            <div class="mt-3.5 p-3.5 rounded-md border border-slate-200 bg-white space-y-2 text-xs sm:text-sm">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Scale class="w-4 h-4 text-emerald-700" />
                  Última entrega verificada
                </span>
                <span class="text-[11px] text-slate-500 font-semibold">Ayer 15:40</span>
              </div>
              <div class="text-xs sm:text-sm text-slate-600 space-y-1">
                <div class="flex justify-between">
                  <span>18.5 kg PET Transparente</span>
                  <span class="font-bold text-emerald-800">+370 Pts</span>
                </div>
                <div class="flex justify-between">
                  <span>12.0 kg Cartón Corrugado</span>
                  <span class="font-bold text-emerald-800">+120 Pts</span>
                </div>
              </div>
              <div class="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span>Báscula certificada #B-0412</span>
                <span class="font-mono text-slate-900 font-bold">REC-BOG-9831</span>
              </div>
            </div>

            <!-- Canje Voucher Preview -->
            <div class="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <Gift class="w-5 h-5" />
                </div>
                <div>
                  <span class="text-xs sm:text-sm font-extrabold text-slate-900 block leading-tight">Freidora de Aire 4.5L</span>
                  <span class="text-[11px] text-slate-500 font-mono font-bold">CANJE-COL-94821</span>
                </div>
              </div>
              <span class="text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md shrink-0">
                Listo para entrega
              </span>
            </div>

            <!-- Guarantee microcopy -->
            <p class="mt-3 text-[11px] text-slate-500 text-center leading-relaxed">
              🔒 Verificación con empresas afiliadas. Los puntos no vencen mientras mantengas actividad.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import {
  CheckCircle,
  Calculator,
  ShieldCheck,
  MapPin,
  Gift,
  Scale
} from 'lucide-vue-next';

defineProps({
  stats: {
    type: Object,
    required: true,
  },
});
</script>
