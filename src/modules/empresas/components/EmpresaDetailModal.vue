<template>
  <div
    v-if="isOpen && empresa"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-white sm:bg-black/60 sm:backdrop-blur-xs animate-in fade-in duration-200"
    @click="$emit('close')"
  >
    <div
      class="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-white sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden border-0 sm:border border-slate-200 flex flex-col animate-in slide-in-from-bottom duration-200"
      @click.stop
    >
      <!-- Top Mobile Bar / Close -->
      <div class="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none select-none">
        <button
          type="button"
          @click="$emit('close')"
          class="pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer"
          aria-label="Volver"
        >
          <ArrowLeft class="w-5 h-5 sm:hidden stroke-[2.2]" />
          <X class="w-5 h-5 hidden sm:block stroke-[2.2]" />
        </button>

        <span class="pointer-events-auto text-[11px] font-semibold text-white bg-emerald-600/90 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs">
          Perfil Verificado
        </span>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Hero Cover -->
        <div class="relative h-44 sm:h-52 w-full bg-slate-200">
          <SafeImage
            :src="empresa.coverImage"
            :alt="empresa.name"
            containerClass="w-full h-full absolute inset-0"
            imgClass="w-full h-full object-cover"
            fallbackText="Portada de empresa"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-black/20 to-transparent" />

          <!-- Overlapping Logo -->
          <div class="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl bg-white p-1.5 shadow-xl border-2 border-white">
            <SafeImage
              :src="empresa.logo"
              :alt="empresa.name"
              containerClass="w-full h-full rounded-xl overflow-hidden"
              imgClass="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Header Info -->
        <div class="pt-10 px-6 pb-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                  {{ empresa.name }}
                </h2>
                <BadgeCheck class="w-5 h-5 text-emerald-600 shrink-0" />
              </div>

              <div class="flex items-center gap-2 mt-1 text-xs text-slate-600">
                <span class="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {{ empresa.category }}
                </span>
                <span>•</span>
                <div class="flex items-center gap-1 text-amber-500 font-bold">
                  <Star class="w-3.5 h-3.5 fill-amber-400" />
                  <span>{{ empresa.rating }}</span>
                  <span class="text-slate-400 font-normal">({{ empresa.reviewsCount }} opiniones)</span>
                </div>
              </div>
            </div>

            <!-- Distance & Location badge -->
            <div class="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl self-start">
              <MapPin class="w-4 h-4 text-emerald-600" />
              <span>{{ empresa.location }} (a {{ empresa.distanceKm }})</span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
            {{ empresa.description }}
          </p>

          <!-- Highlights Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <div class="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
              <Award class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span class="text-xs font-bold text-emerald-950 block">Incentivo ecológico</span>
                <span class="text-[11px] text-emerald-800">{{ empresa.incentive }}</span>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5">
              <Truck class="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span class="text-xs font-bold text-sky-950 block">Recolección a domicilio</span>
                <span class="text-[11px] text-sky-800">{{ empresa.pickupDays }}</span>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-2.5">
              <ShieldCheck class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span class="text-xs font-bold text-amber-950 block">Certificación</span>
                <span class="text-[11px] text-amber-800">{{ empresa.badge }}</span>
              </div>
            </div>
          </div>

          <!-- Accepted Materials Section -->
          <div class="mt-6 space-y-3">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Recycle class="w-4 h-4 text-emerald-600" />
              <span>Materiales aceptados en planta y domicilio</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="mat in empresa.acceptedMaterials"
                :key="mat.id"
                class="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center gap-2.5"
              >
                <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <span class="text-xs font-semibold text-slate-800">{{ mat.label }}</span>
              </div>
            </div>
          </div>

          <!-- Requirements Section -->
          <div class="mt-6 space-y-2.5">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <span>Requisitos de entrega limpia</span>
            </h4>

            <ul class="space-y-1.5">
              <li
                v-for="(req, i) in empresa.requirements"
                :key="i"
                class="flex items-start gap-2 text-xs text-slate-600"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{{ req }}</span>
              </li>
            </ul>
          </div>

          <!-- Contact Section -->
          <div class="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Atención y Logística
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div>
                <span class="text-slate-400 block text-[11px]">Teléfono</span>
                <span class="font-semibold text-slate-800">{{ empresa.contact.phone }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Email</span>
                <span class="font-semibold text-slate-800">{{ empresa.contact.email }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Horario de entrega</span>
                <span class="font-semibold text-slate-800">{{ empresa.contact.schedule }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar Action -->
      <div class="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          Cerrar
        </button>

        <!-- Subscription Status Button -->
        <button
          v-if="isSubscribedToThis"
          type="button"
          @click="handleCancel"
          class="px-5 py-2.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <XCircle class="w-4 h-4" />
          <span>Cancelar suscripción</span>
        </button>

        <button
          v-else-if="isSubscribedToOther"
          type="button"
          disabled
          class="px-5 py-2.5 text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200 rounded-xl cursor-not-allowed opacity-60 flex items-center gap-1.5"
          title="Ya estás suscrito a otra empresa"
        >
          <Lock class="w-4 h-4" />
          <span>Ya tienes otra empresa suscrita</span>
        </button>

        <button
          v-else
          type="button"
          @click="handleSubscribe"
          class="px-6 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCircle2 class="w-4 h-4" />
          <span>Suscribirme a esta empresa</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  X,
  ArrowLeft,
  BadgeCheck,
  Star,
  MapPin,
  Award,
  Truck,
  ShieldCheck,
  Recycle,
  CheckCircle2,
  XCircle,
  Lock
} from 'lucide-vue-next';
import { useEmpresaStore } from '../store/empresaStore';
import SafeImage from '@/shared/components/SafeImage.vue';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  empresa: {
    type: Object,
    default: null,
  },
});

useBodyScrollLock(() => props.isOpen);

const emit = defineEmits(['close']);
const empresaStore = useEmpresaStore();

const isSubscribedToThis = computed(() => {
  return empresaStore.activeSubscription?.empresaId === props.empresa?.id;
});

const isSubscribedToOther = computed(() => {
  return (
    empresaStore.hasActiveSubscription &&
    empresaStore.activeSubscription?.empresaId !== props.empresa?.id
  );
});

function handleSubscribe() {
  emit('close');
  empresaStore.openSubscribe(props.empresa);
}

function handleCancel() {
  emit('close');
  empresaStore.openCancelConfirm();
}
</script>
