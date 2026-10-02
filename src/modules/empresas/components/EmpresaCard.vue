<template>
  <div
    class="bg-white rounded-xl border transition-colors duration-150 overflow-hidden flex flex-col justify-between shadow-2xs select-none"
    :class="[
      isSubscribedToThis
        ? 'border-emerald-500 ring-1 ring-emerald-500/30'
        : 'border-slate-200/90 hover:border-slate-300'
    ]"
  >
    <!-- Top Cover & Logo Section -->
    <div class="relative h-24 w-full bg-slate-100">
      <SafeImage
        :src="empresa.coverImage"
        :alt="empresa.name"
        containerClass="w-full h-full absolute inset-0"
        imgClass="w-full h-full object-cover"
        fallbackText="Empresa de reciclaje"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      <!-- Active Subscription Badge on Cover -->
      <div
        v-if="isSubscribedToThis"
        class="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs"
      >
        <CheckCircle2 class="w-3 h-3" />
        <span>Tu empresa</span>
      </div>

      <!-- Distance Tag -->
      <div
        v-else
        class="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs"
      >
        <MapPin class="w-3 h-3 text-emerald-400" />
        <span>{{ empresa.distanceKm }}</span>
      </div>

      <!-- Overlapping Avatar / Logo -->
      <div class="absolute -bottom-5 left-3.5 w-12 h-12 rounded-xl bg-white p-1 shadow-sm border border-slate-200">
        <SafeImage
          :src="empresa.logo"
          :alt="empresa.name"
          containerClass="w-full h-full rounded-lg overflow-hidden"
          imgClass="w-full h-full object-cover"
          fallbackText="Logo"
        />
      </div>
    </div>

    <!-- Card Body -->
    <div class="pt-6.5 px-3.5 pb-3 flex-1 flex flex-col justify-between">
      <div>
        <!-- Title & Category -->
        <div class="flex items-start justify-between gap-1">
          <RouterLink
            :to="`/empresas/${empresa.id}`"
            class="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-1 hover:text-emerald-700 transition-colors"
          >
            {{ empresa.name }}
          </RouterLink>
        </div>

        <div class="flex items-center gap-1 mt-1 text-slate-500 text-[11px]">
          <Recycle class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span class="font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] truncate max-w-[180px]">
            {{ empresa.category }}
          </span>
        </div>

        <!-- Rating & Location -->
        <div class="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
          <div class="flex items-center gap-0.5 text-amber-500 font-semibold">
            <Star class="w-3 h-3 fill-amber-400" />
            <span>{{ empresa.rating }}</span>
            <span class="text-slate-400 font-normal">({{ empresa.reviewsCount }})</span>
          </div>
          <span>•</span>
          <span class="truncate">{{ empresa.location }}</span>
        </div>

        <!-- Incentive Highlight -->
        <div class="mt-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-700">
          <Award class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span class="font-medium truncate text-[10.5px]">{{ empresa.incentive }}</span>
        </div>

        <!-- Accepted Materials Chips preview -->
        <div class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="mat in empresa.acceptedMaterials.slice(0, 2)"
            :key="mat.id"
            class="text-[9.5px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded truncate max-w-[130px]"
          >
            {{ mat.label }}
          </span>
          <span
            v-if="empresa.acceptedMaterials.length > 2"
            class="text-[9.5px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold"
          >
            +{{ empresa.acceptedMaterials.length - 2 }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-3.5 pt-2.5 border-t border-slate-100 space-y-1.5">
        <!-- Button 1: Ver perfil de la empresa (Full Interface) -->
        <RouterLink
          :to="`/empresas/${empresa.id}`"
          class="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
        >
          <Building2 class="w-3.5 h-3.5 text-slate-500" />
          <span>Ver perfil de la empresa</span>
        </RouterLink>

        <!-- Button 2: Suscribirme OR Cancelar suscripción OR Desactivado -->
        <!-- Case A: This company is the user's active subscription -->
        <button
          v-if="isSubscribedToThis"
          type="button"
          @click="empresaStore.openCancelConfirm()"
          class="w-full py-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          title="Cancelar suscripción a esta empresa"
        >
          <XCircle class="w-3.5 h-3.5" />
          <span>Cancelar suscripción</span>
        </button>

        <!-- Case B: User already subscribed to another company (Disabled state) -->
        <button
          v-else-if="isSubscribedToOther"
          type="button"
          disabled
          class="w-full py-1.5 px-2.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 text-xs font-medium cursor-not-allowed flex items-center justify-center gap-1.5 opacity-60"
          title="Ya tienes una empresa suscrita. Cancela tu suscripción actual para elegir esta."
        >
          <Lock class="w-3.5 h-3.5" />
          <span>Suscripción no disponible</span>
        </button>

        <!-- Case C: User has no active subscription (Opens Full View or Modal) -->
        <RouterLink
          v-else
          :to="`/empresas/${empresa.id}/suscribirme`"
          class="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
        >
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>Suscribirme a una empresa</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Building2,
  Recycle,
  Star,
  MapPin,
  Award,
  CheckCircle2,
  XCircle,
  Lock
} from 'lucide-vue-next';
import { useEmpresaStore } from '../store/empresaStore';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  empresa: {
    type: Object,
    required: true,
  },
});

const empresaStore = useEmpresaStore();

const isSubscribedToThis = computed(() => {
  return empresaStore.activeSubscription?.empresaId === props.empresa.id;
});

const isSubscribedToOther = computed(() => {
  return (
    empresaStore.hasActiveSubscription &&
    empresaStore.activeSubscription?.empresaId !== props.empresa.id
  );
});
</script>
