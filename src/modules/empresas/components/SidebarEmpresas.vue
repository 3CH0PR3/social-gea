<template>
  <aside class="hidden lg:flex flex-col gap-3 w-68 shrink-0 sticky top-18 h-[calc(100vh-5rem)] overflow-y-auto pr-2 select-none">
    <!-- Back to Feed shortcut -->
    <RouterLink
      to="/feeds"
      class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
    >
      <ArrowLeft class="w-4 h-4 stroke-[2.2]" />
      <span>Volver al Feed principal</span>
    </RouterLink>

    <!-- Header Module Title -->
    <div class="px-3 pt-1">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Building2 class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900 leading-tight">Empresas</h2>
          <span class="text-[11px] text-slate-500">Directorio de Reciclaje</span>
        </div>
      </div>
    </div>

    <!-- Search Input (Single search, no filters) -->
    <div class="px-2 pt-1">
      <div class="relative">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          :value="searchQuery"
          @input="setSearch($event.target.value)"
          placeholder="Buscar empresas..."
          class="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 shadow-2xs"
        />
        <button
          v-if="searchQuery"
          type="button"
          @click="setSearch('')"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          title="Limpiar búsqueda"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- Active Subscription Status Block in Aside -->
    <div class="px-2 pt-1">
      <!-- State 1: Active Subscription -->
      <div
        v-if="activeSubscription && activeEmpresa"
        class="p-3 rounded-xl bg-white border border-emerald-500/50 shadow-xs space-y-2.5"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <CheckCircle2 class="w-3 h-3" />
            Tu empresa activa
          </span>
          <span class="text-[10px] text-slate-400 font-mono">
            #{{ activeSubscription.applicationId }}
          </span>
        </div>

        <div class="flex items-center gap-2.5">
          <img
            :src="activeEmpresa.logo"
            :alt="activeEmpresa.name"
            class="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-slate-900 truncate">{{ activeEmpresa.name }}</h4>
            <span class="text-[11px] text-slate-500 truncate block">{{ activeEmpresa.category }}</span>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <button
            type="button"
            @click="empresaStore.openApplicationDetails"
            class="flex-1 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-colors text-center cursor-pointer border border-slate-200"
          >
            Ver solicitud
          </button>
          <button
            type="button"
            @click="empresaStore.openCancelConfirm"
            class="py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-colors text-center cursor-pointer border border-rose-200"
            title="Cancelar suscripción"
          >
            Cancelar
          </button>
        </div>
      </div>

      <!-- State 2: No active subscription -->
      <div
        v-else
        class="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5"
      >
        <div class="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <ShieldCheck class="w-4 h-4 text-emerald-600" />
          <span>Suscripción libre</span>
        </div>
        <p class="text-[11px] text-slate-500 leading-snug">
          Puedes suscribirte a <strong>1 empresa de reciclaje</strong>. Al elegir una, se reservará tu cupo para entregas.
        </p>
      </div>
    </div>

    <!-- Navigation Shortcuts -->
    <div class="px-2 space-y-0.5">
      <RouterLink
        to="/empresas"
        class="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-200/50 transition-colors"
        :class="{ '!bg-emerald-50 !text-emerald-800 !font-bold': $route.path === '/empresas' }"
      >
        <div class="flex items-center gap-2.5">
          <Building2 class="w-4 h-4 text-emerald-600" />
          <span>Todas las empresas</span>
        </div>
        <span class="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
          {{ empresas.length }}
        </span>
      </RouterLink>

      <RouterLink
        v-if="activeEmpresa"
        :to="`/empresas/${activeEmpresa.id}`"
        class="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-200/50 transition-colors"
        :class="{ '!bg-emerald-50 !text-emerald-800 !font-bold': $route.path === `/empresas/${activeEmpresa.id}` }"
      >
        <div class="flex items-center gap-2.5">
          <CheckCircle2 class="w-4 h-4 text-emerald-600" />
          <span class="truncate max-w-[130px]">Mi empresa: {{ activeEmpresa.name }}</span>
        </div>
        <span class="w-2 h-2 rounded-full bg-emerald-500" />
      </RouterLink>

      <button
        v-if="activeSubscription"
        type="button"
        @click="empresaStore.openApplicationDetails"
        class="w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-200/50 transition-colors text-left cursor-pointer"
      >
        <div class="flex items-center gap-2.5">
          <FileText class="w-4 h-4 text-slate-500" />
          <span>Mi solicitud enviada</span>
        </div>
      </button>
    </div>

    <!-- Quick Tip Footer -->
    <div class="mt-auto px-3 py-2 text-[11px] text-slate-400 space-y-1 border-t border-slate-200/80">
      <p class="font-medium text-slate-500 flex items-center gap-1">
        <Recycle class="w-3.5 h-3.5 text-emerald-600" />
        <span>Red Conecta Reciclaje</span>
      </p>
      <p class="text-[10px] leading-tight">
        Postula a una empresa, programa tus retiros y canjea puntos ecológicos.
      </p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import {
  ArrowLeft,
  Building2,
  Search,
  X,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Recycle
} from 'lucide-vue-next';
import { useEmpresaStore } from '../store/empresaStore';

const route = useRoute();
const empresaStore = useEmpresaStore();

const empresas = computed(() => empresaStore.empresas);
const searchQuery = computed(() => empresaStore.searchQuery);
const activeSubscription = computed(() => empresaStore.activeSubscription);
const activeEmpresa = computed(() => empresaStore.activeEmpresa);

function setSearch(val) {
  empresaStore.setSearch(val);
}
</script>
