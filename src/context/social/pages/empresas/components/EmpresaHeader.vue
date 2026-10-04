<script setup>
import { ArrowLeft, CheckCircle2, MapPin, Building2, ExternalLink, ShieldCheck, HeartHandshake } from 'lucide-vue-next';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  empresa: {
    type: Object,
    required: true,
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['open-subscribe', 'open-cancel']);
</script>

<template>
  <div class="space-y-4">
    <!-- Breadcrumb & Top Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <RouterLink
        to="/empresas"
        class="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors"
      >
        <ArrowLeft class="w-4 h-4 stroke-[2.2]" />
        <span>Volver a Empresas</span>
      </RouterLink>

      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400 hidden sm:inline">Empresas /</span>
        <span class="text-xs font-bold text-slate-800 truncate max-w-[200px]">{{ empresa.name }}</span>
        <span
          v-if="isSubscribed"
          class="ml-2 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1"
        >
          <CheckCircle2 class="w-3 h-3" />
          <span>Suscrito</span>
        </span>
      </div>
    </div>

    <!-- Hero Card Interface -->
    <div class="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
      <!-- Panoramic Cover -->
      <div class="relative h-48 sm:h-56 md:h-64 w-full bg-slate-200">
        <SafeImage
          :src="empresa.coverImage"
          :alt="empresa.name"
          containerClass="w-full h-full absolute inset-0"
          imgClass="w-full h-full object-cover"
          fallbackText="Portada de empresa"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        <!-- Top Distance Badge -->
        <div class="absolute top-3 right-3 flex items-center gap-2">
          <span class="text-xs font-medium text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
            <MapPin class="w-3.5 h-3.5 text-emerald-400" />
            <span>A {{ empresa.distanceKm }} de tu ubicación</span>
          </span>
        </div>

        <!-- Overlapping Logo & Main Identity -->
        <div class="absolute -bottom-8 left-6 flex items-end gap-3 z-10">
          <div class="w-20 h-20 sm:w-22 sm:h-22 rounded-xl bg-white p-1 shadow-md border border-slate-200 shrink-0">
            <SafeImage
              :src="empresa.logo"
              :alt="empresa.name"
              containerClass="w-full h-full rounded-lg overflow-hidden"
              imgClass="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Identity & Quick Info -->
      <div class="pt-10 px-6 pb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {{ empresa.category }}
              </span>
              <span v-if="empresa.verified" class="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
                <span>Aliada Verificada</span>
              </span>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {{ empresa.name }}
            </h1>
            <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ empresa.location }} · {{ empresa.address }}</span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              v-if="!isSubscribed"
              type="button"
              @click="emit('open-subscribe')"
              class="sg-btn sg-btn--primary"
            >
              <HeartHandshake class="w-4 h-4" />
              <span>Afiliarme a esta empresa</span>
            </button>
            <button
              v-else
              type="button"
              @click="emit('open-cancel')"
              class="sg-btn sg-btn--secondary text-rose-600 hover:text-rose-700"
            >
              <span>Cancelar vinculación</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
