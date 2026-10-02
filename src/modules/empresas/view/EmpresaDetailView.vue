<template>
  <div v-if="empresa" class="w-full max-w-5xl mx-auto space-y-4 pb-16 animate-in fade-in duration-200">
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
          v-if="isSubscribedToThis"
          class="ml-2 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1"
        >
          <CheckCircle2 class="w-3 h-3" />
          <span>Suscrito</span>
        </span>
      </div>
    </div>

    <!-- Hero Card Interface (Refined, not bloated) -->
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
      <div class="pt-10 sm:pt-11 px-6 pb-5">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                {{ empresa.name }}
              </h1>
              <BadgeCheck class="w-5 h-5 text-emerald-600 shrink-0" />
            </div>

            <div class="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600">
              <span class="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {{ empresa.category }}
              </span>
              <span>•</span>
              <div class="flex items-center gap-1 text-amber-500 font-bold">
                <Star class="w-3.5 h-3.5 fill-amber-400" />
                <span>{{ empresa.rating }}</span>
                <span class="text-slate-400 font-normal">({{ empresa.reviewsCount }} opiniones)</span>
              </div>
              <span>•</span>
              <span class="text-slate-500">{{ empresa.location }}</span>
            </div>
          </div>

          <!-- Quick Incentive Badge -->
          <div class="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950 self-start lg:self-center">
            <Award class="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span class="font-bold block text-[11px]">Incentivo Oficial:</span>
              <span class="text-emerald-800 font-medium">{{ empresa.incentive }}</span>
            </div>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed max-w-4xl">
          {{ empresa.description }}
        </p>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-100">
          <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span class="text-[10px] text-slate-400 font-medium block">Puntos por kg</span>
            <span class="text-xs sm:text-sm font-extrabold text-emerald-700">15 - 35 Pts</span>
          </div>

          <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span class="text-[10px] text-slate-400 font-medium block">Recolección</span>
            <span class="text-xs sm:text-sm font-bold text-slate-800">
              {{ empresa.pickupAvailable ? 'A domicilio' : 'Punto limpio' }}
            </span>
          </div>

          <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span class="text-[10px] text-slate-400 font-medium block">Certificación</span>
            <span class="text-xs font-semibold text-slate-800 truncate block">{{ empresa.badge }}</span>
          </div>

          <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span class="text-[10px] text-slate-400 font-medium block">Distancia radar</span>
            <span class="text-xs sm:text-sm font-bold text-slate-800">{{ empresa.distanceKm }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dynamic Subscription Action Bar -->
    <!-- Case 1: Subscribed to this company -->
    <div
      v-if="isSubscribedToThis"
      class="p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white shadow-xs border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
          <CheckCircle2 class="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <span class="text-[9.5px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white px-1.5 py-0.5 rounded">
            Tu Empresa Asignada
          </span>
          <h3 class="text-sm font-bold text-white mt-0.5">
            Suscripción activa con {{ empresa.name }}
          </h3>
          <p class="text-[11px] text-emerald-200">
            Solicitud #{{ activeSubscription.applicationId }} · Registrada el {{ activeSubscription.subscribedAt }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0 self-end md:self-center">
        <button
          type="button"
          @click="empresaStore.openApplicationDetails"
          class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <FileText class="w-3.5 h-3.5" />
          <span>Ver mi solicitud</span>
        </button>

        <button
          type="button"
          @click="empresaStore.openCancelConfirm"
          class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <XCircle class="w-3.5 h-3.5" />
          <span>Cancelar suscripción</span>
        </button>
      </div>
    </div>

    <!-- Case 2: Subscribed to another company -->
    <div
      v-else-if="isSubscribedToOther"
      class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col md:flex-row md:items-center justify-between gap-3"
    >
      <div class="flex items-start gap-2.5">
        <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 class="text-xs font-bold text-amber-950">
            Ya tienes una empresa de reciclaje asignada
          </h3>
          <p class="text-[11px] text-amber-800 mt-0.5 max-w-xl leading-snug">
            Actualmente estás suscrito a <strong>{{ activeEmpresa?.name }}</strong>. Cancela tu suscripción actual para poder postular a {{ empresa.name }}.
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="empresaStore.openCancelConfirm"
        class="px-3 py-1.5 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors shrink-0 cursor-pointer"
      >
        Cancelar suscripción actual
      </button>
    </div>

    <!-- Case 3: Available to subscribe -->
    <div
      v-else
      class="p-3.5 sm:p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
    >
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Recycle class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-xs sm:text-sm font-bold text-white leading-tight">
            ¿Deseas vincularte con {{ empresa.name }}?
          </h3>
          <p class="text-[11px] text-slate-300 mt-0.5">
            Recibe incentivos ecológicos y coordina recolecciones directas en tu zona.
          </p>
        </div>
      </div>

      <RouterLink
        :to="`/empresas/${empresa.id}/suscribirme`"
        class="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
      >
        <CheckCircle2 class="w-4 h-4" />
        <span>Suscribirme a esta empresa</span>
      </RouterLink>
    </div>

    <!-- Unified Information Container (Tabs cleanly at the top of the card) -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      <!-- Solid Clean Tab Header Strip (Firmly at the top, no sticky overflow bug, no overlapping text) -->
      <div class="grid grid-cols-4 border-b border-slate-200 bg-slate-50/90 p-1 gap-1 select-none">
        <button
          type="button"
          @click="setTab('materiales')"
          class="py-2 px-1 text-center text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          :class="[
            activeTab === 'materiales'
              ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-slate-200/90'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
          ]"
        >
          <Recycle class="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span class="hidden sm:inline">Materiales & Requisitos</span>
          <span class="sm:hidden text-[11px]">Materiales</span>
        </button>

        <button
          type="button"
          @click="setTab('logistica')"
          class="py-2 px-1 text-center text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          :class="[
            activeTab === 'logistica'
              ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-slate-200/90'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
          ]"
        >
          <Truck class="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span class="hidden sm:inline">Puntos Limpios & Horarios</span>
          <span class="sm:hidden text-[11px]">Logística</span>
        </button>

        <button
          type="button"
          @click="setTab('incentivos')"
          class="py-2 px-1 text-center text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          :class="[
            activeTab === 'incentivos'
              ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-slate-200/90'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
          ]"
        >
          <Award class="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span class="hidden sm:inline">Incentivos & Puntos</span>
          <span class="sm:hidden text-[11px]">Incentivos</span>
        </button>

        <button
          type="button"
          @click="setTab('acerca')"
          class="py-2 px-1 text-center text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          :class="[
            activeTab === 'acerca'
              ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-slate-200/90'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
          ]"
        >
          <Building2 class="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span class="hidden sm:inline">Empresa & Contacto</span>
          <span class="sm:hidden text-[11px]">Contacto</span>
        </button>
      </div>

      <!-- Integrated Content Area (Directly inside the unified card) -->
      <div class="p-4 sm:p-5">
        <!-- Tab 1: Materiales & Requisitos -->
        <div v-if="activeTab === 'materiales'" class="space-y-4 animate-in fade-in duration-150">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Materiales aceptados en planta y domicilio</h3>
                <p class="text-[11px] text-slate-500">Clasificación oficial aprobada para valorización</p>
              </div>
              <span class="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                {{ empresa.acceptedMaterials.length }} tipos
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div
                v-for="mat in empresa.acceptedMaterials"
                :key="mat.id"
                class="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2.5"
              >
                <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 text-xs">{{ mat.label }}</h4>
                  <p class="text-[10.5px] text-slate-500 mt-0.5">
                    Apto para proceso de compactado y reciclaje circular directo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Clean Preparation Guidelines -->
          <div class="pt-4 border-t border-slate-100 space-y-2.5">
            <div class="flex items-center gap-2">
              <ShieldCheck class="w-4 h-4 text-emerald-600" />
              <h3 class="font-bold text-slate-900 text-xs sm:text-sm">Requisitos de entrega limpia</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div
                v-for="(req, i) in empresa.requirements"
                :key="i"
                class="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100/80 space-y-1"
              >
                <span class="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {{ i + 1 }}
                </span>
                <p class="text-xs text-slate-700 font-medium leading-relaxed">{{ req }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Puntos Limpios & Horarios -->
        <div v-else-if="activeTab === 'logistica'" class="space-y-4 animate-in fade-in duration-150">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Pickup details -->
            <div class="space-y-2.5">
              <div class="flex items-center gap-2">
                <Truck class="w-4 h-4 text-emerald-600" />
                <h3 class="font-bold text-slate-900 text-xs sm:text-sm">Rutas de Recolección a Domicilio</h3>
              </div>

              <div class="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div class="flex justify-between py-1 border-b border-slate-200/60">
                  <span class="text-slate-500">Disponibilidad</span>
                  <span class="font-bold text-emerald-700">{{ empresa.pickupAvailable ? 'Activa' : 'Solo en planta' }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-200/60">
                  <span class="text-slate-500">Días y Horarios</span>
                  <span class="font-semibold text-slate-800 text-right">{{ empresa.pickupDays }}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-slate-500">Costo del retiro</span>
                  <span class="font-bold text-emerald-700">100% Gratuito al suscribirte</span>
                </div>
              </div>
            </div>

            <!-- Plant / Drop-off Point -->
            <div class="space-y-2.5">
              <div class="flex items-center gap-2">
                <MapPin class="w-4 h-4 text-emerald-600" />
                <h3 class="font-bold text-slate-900 text-xs sm:text-sm">Punto Limpio Central</h3>
              </div>

              <div class="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div>
                  <span class="text-slate-400 block text-[11px]">Ubicación física</span>
                  <span class="font-semibold text-slate-800">{{ empresa.location }}</span>
                </div>
                <div class="pt-2 border-t border-slate-200/60">
                  <span class="text-slate-400 block text-[11px]">Horario de recepción</span>
                  <span class="font-semibold text-slate-800">{{ empresa.contact.schedule }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Incentivos & Puntos Verde -->
        <div v-else-if="activeTab === 'incentivos'" class="space-y-3 animate-in fade-in duration-150">
          <div class="flex items-center gap-2">
            <Award class="w-4 h-4 text-emerald-600" />
            <h3 class="font-bold text-slate-900 text-xs sm:text-sm">Tabla de Recompensas e Incentivos</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th class="py-2 px-3">Material</th>
                  <th class="py-2 px-3">Puntos por kg</th>
                  <th class="py-2 px-3">Beneficio Adicional</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="mat in empresa.acceptedMaterials" :key="mat.id" class="hover:bg-slate-50/50">
                  <td class="py-2.5 px-3 font-semibold text-slate-800">{{ mat.label }}</td>
                  <td class="py-2.5 px-3 font-bold text-emerald-600">20 - 30 Pts</td>
                  <td class="py-2.5 px-3 text-slate-600">Certificado digital de CO2 compensado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 4: Empresa & Contacto -->
        <div v-else-if="activeTab === 'acerca'" class="space-y-3 animate-in fade-in duration-150">
          <h3 class="font-bold text-slate-900 text-xs sm:text-sm">Información Institucional</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            {{ empresa.description }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
            <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <span class="text-slate-400 block text-[10.5px]">Teléfono de atención</span>
              <span class="font-bold text-slate-900 mt-0.5 block">{{ empresa.contact.phone }}</span>
            </div>

            <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <span class="text-slate-400 block text-[10.5px]">Correo oficial</span>
              <span class="font-bold text-slate-900 mt-0.5 block truncate">{{ empresa.contact.email }}</span>
            </div>

            <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <span class="text-slate-400 block text-[10.5px]">Horario comercial</span>
              <span class="font-bold text-slate-900 mt-0.5 block">{{ empresa.contact.schedule }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EmpresaSubscribeModal
      :isOpen="empresaStore.isSubscribeModalOpen"
      :empresa="empresa"
      @close="empresaStore.closeSubscribe"
    />

    <ApplicationDetailsModal
      :isOpen="empresaStore.isApplicationDetailModalOpen"
      @close="empresaStore.closeApplicationDetails"
    />

    <CancelConfirmModal
      :isOpen="empresaStore.isCancelModalOpen"
      @close="empresaStore.closeCancelConfirm"
    />
  </div>

  <!-- Loading / Not Found State -->
  <div v-else class="bg-white rounded-xl p-10 text-center border border-slate-200 space-y-3 max-w-md mx-auto">
    <Building2 class="w-10 h-10 text-slate-300 mx-auto" />
    <h3 class="font-bold text-slate-800 text-base">Empresa no encontrada</h3>
    <p class="text-xs text-slate-500">
      La empresa solicitada no existe o fue retirada del directorio.
    </p>
    <RouterLink
      to="/empresas"
      class="inline-block px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg"
    >
      Volver al catálogo
    </RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import {
  ArrowLeft,
  Building2,
  Recycle,
  Star,
  MapPin,
  Award,
  Truck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BadgeCheck,
  FileText
} from 'lucide-vue-next';
import { useEmpresaStore } from '../store/empresaStore';
import SafeImage from '@/shared/components/SafeImage.vue';
import EmpresaSubscribeModal from '../components/EmpresaSubscribeModal.vue';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal.vue';
import CancelConfirmModal from '../components/CancelConfirmModal.vue';

const route = useRoute();
const router = useRouter();
const empresaStore = useEmpresaStore();

const validTabs = ['materiales', 'logistica', 'incentivos', 'acerca'];

const activeTab = computed(() => {
  const q = route.query.tab;
  return typeof q === 'string' && validTabs.includes(q) ? q : 'materiales';
});

function setTab(tabId) {
  router.replace({
    query: {
      ...route.query,
      tab: tabId,
    },
  });
}

const empresa = computed(() => {
  return empresaStore.getEmpresaById(route.params.id);
});

const isSubscribedToThis = computed(() => {
  return empresaStore.activeSubscription?.empresaId === empresa.value?.id;
});

const isSubscribedToOther = computed(() => {
  return (
    empresaStore.hasActiveSubscription &&
    empresaStore.activeSubscription?.empresaId !== empresa.value?.id
  );
});

const activeSubscription = computed(() => empresaStore.activeSubscription);
const activeEmpresa = computed(() => empresaStore.activeEmpresa);
</script>
