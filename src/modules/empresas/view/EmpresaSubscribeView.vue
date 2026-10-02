<template>
  <div v-if="empresa" class="w-full max-w-4xl mx-auto space-y-4 pb-16 animate-in fade-in duration-200">
    <!-- Back Navigation -->
    <div class="flex items-center justify-between gap-3 px-1">
      <RouterLink
        :to="`/empresas/${empresa.id}`"
        class="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors"
      >
        <ArrowLeft class="w-4 h-4 stroke-[2.2]" />
        <span>Volver a {{ empresa.name }}</span>
      </RouterLink>

      <span class="text-xs font-medium text-slate-400">
        Solicitud directa de reciclaje
      </span>
    </div>

    <!-- Company Summary Banner -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-lg bg-slate-50 p-1 border border-slate-200 shrink-0">
          <img :src="empresa.logo" :alt="empresa.name" class="w-full h-full object-cover rounded-md" />
        </div>
        <div>
          <span class="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
            {{ empresa.category }}
          </span>
          <h2 class="text-base font-bold text-slate-900 leading-tight mt-0.5">
            Suscripción a {{ empresa.name }}
          </h2>
          <p class="text-[11px] text-slate-500">
            {{ empresa.location }} · {{ empresa.incentive }}
          </p>
        </div>
      </div>

      <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2 max-w-xs self-start sm:self-center">
        <ShieldCheck class="w-4 h-4 text-emerald-600 shrink-0" />
        <span class="text-[11px] leading-snug">
          Recuerda: Solo puedes tener <strong>1 empresa activa</strong> a la vez.
        </span>
      </div>
    </div>

    <!-- Main Full Form Card -->
    <form @submit.prevent="handleSubmit" class="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
      <!-- Section 1: Official Registration Database Fields (Matches Screenshot 1) -->
      <div class="space-y-4">
        <div class="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
            <UserPlus class="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">Formulario de registro oficial</h3>
            <p class="text-[11px] text-slate-500">Datos para vincularte a la base de datos de usuarios de la empresa</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- 1. Numacro * -->
          <SearchableSelect
            v-model="form.numacro"
            label="Numacro"
            placeholder="Seleccione un numacro"
            :options="NUMACRO_OPTIONS"
            :required="true"
          />

          <!-- 2. Nuis * -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Nuis <span class="text-rose-500">*</span>
            </label>
            <input
              type="text"
              v-model="form.nuis"
              placeholder="Ingrese el NUIS"
              required
              class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200/90 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-800 transition-all placeholder-slate-400"
            />
          </div>

          <!-- 3. Dirección * -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Dirección <span class="text-rose-500">*</span>
            </label>
            <input
              type="text"
              v-model="form.address"
              placeholder="Ingrese la dirección"
              required
              class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200/90 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-800 transition-all placeholder-slate-400"
            />
          </div>

          <!-- 4. Uso del usuario * -->
          <SearchableSelect
            v-model="form.userUsage"
            label="Uso del usuario"
            placeholder="Seleccione un uso del usuario"
            :options="USO_USUARIO_OPTIONS"
            :required="true"
          />

          <!-- 5. Tipo de usuario * -->
          <SearchableSelect
            v-model="form.userType"
            label="Tipo de usuario"
            placeholder="Seleccione un tipo de usuario"
            :options="TIPO_USUARIO_OPTIONS"
            :required="true"
          />

          <!-- 6. Multiusuario * -->
          <SearchableSelect
            v-model="form.multiuser"
            label="Multiusuario"
            placeholder="Seleccione un tipo de usuario"
            :options="MULTIUSUARIO_OPTIONS"
            :required="true"
          />
        </div>
      </div>

      <!-- Section 2: Material Selection -->
      <div class="space-y-3">
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px]">
              2
            </div>
            <div>
              <h3 class="text-xs font-bold text-slate-900">Materiales que vas a reciclar con esta empresa</h3>
              <p class="text-[10.5px] text-slate-500">Selecciona los que planeas separar</p>
            </div>
          </div>
          <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            {{ form.materialsSelected.length }} seleccionados
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <label
            v-for="mat in empresa.acceptedMaterials"
            :key="mat.id"
            class="flex items-center gap-2.5 p-3 rounded-lg border transition-all cursor-pointer"
            :class="[
              form.materialsSelected.includes(mat.id)
                ? 'border-emerald-500 bg-emerald-50/70 shadow-2xs font-semibold text-emerald-950'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
            ]"
          >
            <input
              type="checkbox"
              :value="mat.id"
              v-model="form.materialsSelected"
              class="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
            <div class="min-w-0">
              <span class="text-xs font-bold block">{{ mat.label }}</span>
              <span class="text-[10.5px] text-slate-500">Reciclaje circular garantizado</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Section 3: Delivery Logistics -->
      <div class="space-y-3">
        <div class="flex items-center gap-2 pb-1.5 border-b border-slate-100">
          <div class="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px]">
            3
          </div>
          <div>
            <h3 class="text-xs font-bold text-slate-900">Modalidad y Frecuencia</h3>
            <p class="text-[10.5px] text-slate-500">¿Cómo prefieres coordinar las entregas?</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            class="p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5"
            :class="[
              form.deliveryMode === 'domicilio'
                ? 'border-emerald-500 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-400'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
            ]"
          >
            <input
              type="radio"
              value="domicilio"
              v-model="form.deliveryMode"
              class="w-4 h-4 accent-emerald-600 mt-0.5 cursor-pointer"
            />
            <div>
              <div class="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <Truck class="w-3.5 h-3.5 text-emerald-600" />
                <span>Recolección a Domicilio</span>
              </div>
              <p class="text-[10.5px] text-slate-500 mt-0.5 leading-snug">
                Un operador pasará periódicamente por tu dirección registrada.
              </p>
            </div>
          </label>

          <label
            class="p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5"
            :class="[
              form.deliveryMode === 'punto_verde'
                ? 'border-emerald-500 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-400'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
            ]"
          >
            <input
              type="radio"
              value="punto_verde"
              v-model="form.deliveryMode"
              class="w-4 h-4 accent-emerald-600 mt-0.5 cursor-pointer"
            />
            <div>
              <div class="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <MapPin class="w-3.5 h-3.5 text-emerald-600" />
                <span>Entrega en Punto Limpio / Planta</span>
              </div>
              <p class="text-[10.5px] text-slate-500 mt-0.5 leading-snug">
                Llevarás tus residuos directamente a su centro en {{ empresa.location }}.
              </p>
            </div>
          </label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5 text-emerald-600" />
              <span>Frecuencia estimada</span>
            </label>
            <select
              v-model="form.frequency"
              class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none cursor-pointer"
            >
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal (cada 15 días)</option>
              <option value="mensual">Mensual</option>
              <option value="ocasional">Ocasional (a demanda)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Award class="w-3.5 h-3.5 text-emerald-600" />
              <span>Volumen aproximado</span>
            </label>
            <select
              v-model="form.estimatedVolume"
              class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none cursor-pointer"
            >
              <option value="1-5 kg">Ligero: 1 a 5 kg</option>
              <option value="5-15 kg">Medio: 5 a 15 kg</option>
              <option value="más de 15 kg">Alto: Más de 15 kg</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Section 4: Notes -->
      <div class="space-y-1.5">
        <label class="block text-xs font-semibold text-slate-700">
          Instrucciones adicionales o referencias (opcional)
        </label>
        <textarea
          v-model="form.notes"
          rows="2"
          placeholder="Ejemplo: Acceso por garaje, llamar antes de pasar..."
          class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none resize-none"
        />
      </div>

      <!-- Submit Actions Bar -->
      <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <RouterLink
          :to="`/empresas/${empresa.id}`"
          class="text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
        >
          Cancelar y regresar
        </RouterLink>

        <button
          type="submit"
          :disabled="!isFormValid"
          class="w-full sm:w-auto px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none text-white rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 class="w-4 h-4" />
          <span>Registrar y Vincularme a {{ empresa.name }}</span>
        </button>
        </div>
      </form>
    </div>

    <div v-else class="bg-white rounded-xl p-10 text-center border border-slate-200 space-y-3 max-w-md mx-auto">
      <Building2 class="w-10 h-10 text-slate-300 mx-auto" />
      <h3 class="font-bold text-slate-800 text-base">Empresa no encontrada</h3>
      <RouterLink
        to="/empresas"
        class="inline-block px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg"
      >
        Volver al catálogo
      </RouterLink>
    </div>
  </template>

  <script setup>
  import { reactive, computed, watch } from 'vue';
  import { useRoute, useRouter, RouterLink } from 'vue-router';
  import {
    ArrowLeft,
    Building2,
    ShieldCheck,
    Truck,
    MapPin,
    Calendar,
    Award,
    CheckCircle2,
    UserPlus
  } from 'lucide-vue-next';
  import { useEmpresaStore } from '../store/empresaStore';
  import SearchableSelect from '@/shared/components/SearchableSelect.vue';
  import {
    NUMACRO_OPTIONS,
    USO_USUARIO_OPTIONS,
    TIPO_USUARIO_OPTIONS,
    MULTIUSUARIO_OPTIONS
  } from '../data/registrationOptions';

  const route = useRoute();
  const router = useRouter();
  const empresaStore = useEmpresaStore();

  const empresa = computed(() => {
    return empresaStore.getEmpresaById(route.params.id);
  });

  const form = reactive({
    numacro: 'MAC-01',
    nuis: '10928472',
    address: empresaStore.currentUser?.location || 'Calle 72 # 11-45, Apto 302',
    userUsage: '1 — Residencial',
    userType: '2 — Pequeño generador',
    multiuser: '2 — No multiusuario',
    deliveryMode: 'domicilio',
    materialsSelected: [],
    notes: '',
  });

  const isFormValid = computed(() => {
    return (
      !!form.numacro &&
      !!form.nuis.trim() &&
      !!form.address.trim() &&
      !!form.userUsage &&
      !!form.userType &&
      !!form.multiuser
    );
  });

watch(
  empresa,
  (newEmp) => {
    if (newEmp && newEmp.acceptedMaterials?.length && form.materialsSelected.length === 0) {
      form.materialsSelected = [newEmp.acceptedMaterials[0].id];
    }
  },
  { immediate: true }
);

function handleSubmit() {
  if (!empresa.value) return;
  const ok = empresaStore.submitSubscription(empresa.value.id, { ...form });
  if (ok) {
    router.push(`/empresas/${empresa.value.id}`);
  }
}
</script>
