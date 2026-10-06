<template>
  <section id="territorio" class="sg-landing-section bg-slate-50/50">
    <div class="sg-landing-container">
      <div class="sg-landing-section-header">
        <span class="sg-landing-section-badge">
          Paso 1 Obligatorio · Afiliación Territorial
        </span>
        <h2 class="sg-landing-section-title">
          Encuentra la empresa recicladora aliada en tu municipio
        </h2>
        <p class="sg-landing-section-sub">
          Para que tus puntos sean válidos y canjeables por premios reales, debes afiliarte a un centro de acopio
          o empresa certificada en tu localidad. Ellos pesarán tus materiales y te cargarán los EcoPuntos al instante.
        </p>
      </div>

      <!-- Filter Controls Box -->
      <div class="max-w-6xl mx-auto p-5 sm:p-7 bg-white rounded-md border border-slate-200 shadow-xs mb-10">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <!-- Department Selector -->
          <div>
            <label class="block text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              1. Departamento
            </label>
            <select
              v-model="selectedDept"
              @change="onDeptChange"
              class="w-full px-4 py-2.5 text-sm sm:text-base bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-semibold outline-none focus:border-emerald-700 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Todos los departamentos</option>
              <option v-for="d in departments" :key="d.id" :value="d.name">
                {{ d.name }}
              </option>
            </select>
          </div>

          <!-- Municipality Selector -->
          <div>
            <label class="block text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              2. Municipio / Ciudad
            </label>
            <select
              v-model="selectedMuni"
              class="w-full px-4 py-2.5 text-sm sm:text-base bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-semibold outline-none focus:border-emerald-700 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Todos los municipios</option>
              <option v-for="m in availableMunicipalities" :key="m" :value="m">
                {{ m }}
              </option>
            </select>
          </div>

          <!-- Material Filter -->
          <div>
            <label class="block text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              3. Tipo de material
            </label>
            <select
              v-model="selectedMaterial"
              class="w-full px-4 py-2.5 text-sm sm:text-base bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-semibold outline-none focus:border-emerald-700 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Cualquier material</option>
              <option value="PET">Plásticos & PET</option>
              <option value="Cartón">Cartón & Papel</option>
              <option value="RAEE">Chatarra RAEE (Electrónica)</option>
              <option value="Vidrio">Vidrio</option>
              <option value="Aluminio">Aluminio & Latas</option>
            </select>
          </div>
        </div>

        <!-- Filter helper status -->
        <div class="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-slate-600 gap-3">
          <span>
            Mostrando <strong>{{ filteredCompanies.length }}</strong> de <strong>{{ companies.length }}</strong> empresas aliadas en Colombia
          </span>
          <div class="flex items-center gap-4">
            <button
              v-if="selectedDept || selectedMuni || selectedMaterial"
              type="button"
              @click="resetFilters"
              class="text-sm font-extrabold text-emerald-800 hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
            <button
              type="button"
              @click="isRequestModalOpen = true"
              class="text-sm font-bold text-slate-700 hover:text-slate-950 hover:underline cursor-pointer"
            >
              ¿No encuentras tu municipio?
            </button>
          </div>
        </div>
      </div>

      <!-- Companies Grid -->
      <div v-if="filteredCompanies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="company in filteredCompanies"
          :key="company.id"
          class="sg-landing-card p-6 flex flex-col justify-between"
        >
          <div>
            <!-- Top Badges -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 truncate">
                {{ company.badge }}
              </span>
              <div class="flex items-center gap-1 text-sm font-extrabold text-amber-800 shrink-0">
                <Star class="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{{ company.rating }}</span>
              </div>
            </div>

            <!-- Title & Location -->
            <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {{ company.name }}
            </h3>
            <p class="text-sm text-slate-600 flex items-start gap-1.5 mt-2">
              <MapPin class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{{ company.address }} · <strong>{{ company.municipality }}, {{ company.department }}</strong></span>
            </p>

            <!-- Accepted Materials -->
            <div class="mt-4 pt-3.5 border-t border-slate-100">
              <span class="text-xs font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                Materiales que recibe en báscula:
              </span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="mat in company.materials"
                  :key="mat"
                  class="text-xs sm:text-sm font-semibold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200"
                >
                  {{ mat }}
                </span>
              </div>
            </div>

            <!-- Incentive rate -->
            <div class="mt-4 p-3 rounded-md bg-emerald-50/80 border border-emerald-100 text-sm">
              <span class="text-slate-600 block text-xs font-semibold">Tasa de acreditación:</span>
              <strong class="text-emerald-950 font-black text-sm sm:text-base">{{ company.incentive }}</strong>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              @click="openCompanyDetails(company)"
              class="text-sm font-bold text-slate-600 hover:text-emerald-900 underline cursor-pointer"
            >
              Ver horarios & sede
            </button>

            <RouterLink
              :to="{ path: '/auth/register', query: { empresaId: company.id, empresaName: company.name } }"
              class="sg-landing-btn sg-landing-btn--primary !text-sm !py-2 !min-h-[40px]"
            >
              <Check class="w-4 h-4" />
              <span>Afiliarme aquí</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-14 p-6 sm:p-10 bg-white rounded-md border border-slate-200 max-w-3xl mx-auto space-y-5 shadow-xs">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <Building2 class="w-8 h-8 stroke-[1.8]" />
        </div>
        <div class="space-y-2">
          <h4 class="text-xl sm:text-2xl font-black text-slate-900">
            No encontramos empresas aliadas en este filtro exacto
          </h4>
          <p class="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Puedes restablecer para ver todas las empresas del país, explorar el catálogo completo de premios o solicitar un nodo de acopio en tu municipio.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            @click="resetFilters"
            class="sg-landing-btn sg-landing-btn--primary w-full sm:w-auto cursor-pointer"
          >
            <span>Ver todas las empresas</span>
          </button>

          <a
            href="#premios"
            @click="scrollToRewards"
            class="sg-landing-btn sg-landing-btn--reward w-full sm:w-auto cursor-pointer"
          >
            <Gift class="w-4 h-4" />
            <span>Ver todo el catálogo de premios</span>
          </a>

          <button
            type="button"
            @click="isRequestModalOpen = true"
            class="sg-landing-btn sg-landing-btn--secondary w-full sm:w-auto cursor-pointer"
          >
            <span>Solicitar punto en mi municipio</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================
         MODAL 1: FICHA DETALLADA DE LA EMPRESA
         ======================================================== -->
    <Teleport to="body">
      <Transition name="sg-modal-fade">
        <div
          v-if="selectedCompany"
          class="fixed inset-0 z-[9999] flex flex-col bg-white overflow-hidden sm:bg-black/60 sm:backdrop-blur-xs sm:items-center sm:justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
          :aria-label="selectedCompany.name"
          @click.self="selectedCompany = null"
        >
          <div class="w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg bg-white flex flex-col overflow-hidden sm:rounded-lg sm:border sm:border-slate-200 sm:shadow-2xl">
            <!-- App Bar / Header -->
            <header class="flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white shrink-0">
              <button
                type="button"
                @click="selectedCompany = null"
                class="sm:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer -ml-2"
                aria-label="Volver"
              >
                <ArrowLeft class="w-5 h-5" />
              </button>

              <h3 class="text-sm font-extrabold text-slate-900 truncate flex-1 sm:text-base">
                {{ selectedCompany.name }}
              </h3>

              <button
                type="button"
                @click="selectedCompany = null"
                class="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer -mr-2"
                aria-label="Cerrar"
              >
                <X class="w-5 h-5" />
              </button>
            </header>

            <!-- Modal Content (Single Scroll) -->
            <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 text-xs text-slate-700">
              <div class="p-3 bg-emerald-50/80 border border-emerald-200 rounded-md">
                <span class="text-[10px] uppercase font-bold text-emerald-800 block">Sello & Certificación</span>
                <strong class="text-sm text-emerald-950 font-extrabold">{{ selectedCompany.badge }}</strong>
              </div>

              <!-- Location & Contact -->
              <div class="space-y-2 border-b border-slate-100 pb-3">
                <div class="flex items-start gap-2">
                  <MapPin class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong class="text-slate-900 block">Dirección de la sede:</strong>
                    <span>{{ selectedCompany.address }}</span>
                    <span class="block text-slate-500 font-semibold">{{ selectedCompany.municipality }}, {{ selectedCompany.department }}</span>
                  </div>
                </div>

                <div class="flex items-start gap-2 pt-1">
                  <Clock class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong class="text-slate-900 block">Horarios de pesaje:</strong>
                    <span>{{ selectedCompany.openHours }}</span>
                  </div>
                </div>

                <div class="flex items-start gap-2 pt-1">
                  <Phone class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong class="text-slate-900 block">Teléfono / PBX:</strong>
                    <span>{{ selectedCompany.phone }}</span>
                  </div>
                </div>
              </div>

              <!-- Materials -->
              <div>
                <strong class="text-slate-900 block mb-1.5">Materiales certificados que reciben:</strong>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="m in selectedCompany.materials"
                    :key="m"
                    class="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-semibold border border-slate-200"
                  >
                    {{ m }}
                  </span>
                </div>
              </div>

              <!-- Requisitos de pesaje -->
              <div class="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1">
                <strong class="text-slate-900 block">Requisitos de entrega para validar puntos:</strong>
                <p class="text-slate-600">
                  1. Material limpio, seco y clasificado por tipo.<br>
                  2. Presentar tu código de usuario en Socialgea al operador de báscula.<br>
                  3. Acreditación inmediata en tu balance digital.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <footer class="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                @click="selectedCompany = null"
                class="sg-landing-btn sg-landing-btn--secondary w-1/3 !min-h-[40px]"
              >
                <span>Cerrar</span>
              </button>

              <RouterLink
                :to="{ path: '/auth/register', query: { empresaId: selectedCompany.id, empresaName: selectedCompany.name } }"
                @click="selectedCompany = null"
                class="sg-landing-btn sg-landing-btn--primary w-2/3 !min-h-[40px] text-center"
              >
                <span>Afiliarme a esta empresa</span>
              </RouterLink>
            </footer>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ========================================================
         MODAL 2: SOLICITAR APERTURA DE NODO EN MI MUNICIPIO
         ======================================================== -->
    <Teleport to="body">
      <Transition name="sg-modal-fade">
        <div
          v-if="isRequestModalOpen"
          class="fixed inset-0 z-[9999] flex flex-col bg-white overflow-hidden sm:bg-black/60 sm:backdrop-blur-xs sm:items-center sm:justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Solicitar punto en mi municipio"
          @click.self="isRequestModalOpen = false"
        >
          <div class="w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-white flex flex-col overflow-hidden sm:rounded-lg sm:border sm:border-slate-200 sm:shadow-2xl">
            <header class="flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white shrink-0">
              <button
                type="button"
                @click="isRequestModalOpen = false"
                class="sm:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer -ml-2"
                aria-label="Volver"
              >
                <ArrowLeft class="w-5 h-5" />
              </button>

              <h3 class="text-sm font-extrabold text-slate-900 truncate flex-1 sm:text-base">
                Solicitar nodo de pesaje
              </h3>

              <button
                type="button"
                @click="isRequestModalOpen = false"
                class="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer -mr-2"
                aria-label="Cerrar"
              >
                <X class="w-5 h-5" />
              </button>
            </header>

            <form @submit.prevent="submitNodeRequest" class="flex-1 min-h-0 flex flex-col justify-between">
              <div class="p-4 sm:p-6 space-y-4 overflow-y-auto overscroll-contain text-xs text-slate-700">
                <div v-if="requestSuccess" class="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-900 space-y-1">
                  <div class="flex items-center gap-2 font-bold text-sm">
                    <Check class="w-4 h-4 text-emerald-700" />
                    <span>¡Solicitud registrada con éxito!</span>
                  </div>
                  <p class="text-xs text-slate-600">
                    Hemos sumado tu municipio a la lista de prioridades de apertura territorial. Te avisaremos por correo apenas habilitemos el nodo.
                  </p>
                </div>

                <template v-else>
                  <p class="text-xs text-slate-600">
                    Si tu municipio aún no cuenta con empresa recicladora aliada, regístralo aquí. Convocamos a cooperativas y recicladores locales cuando alcanzamos suficientes peticiones vecinales.
                  </p>

                  <div class="space-y-1">
                    <label class="block text-xs font-bold text-slate-700">Tu departamento</label>
                    <input
                      v-model="nodeForm.department"
                      type="text"
                      required
                      placeholder="Ej. Boyacá, Huila, Meta..."
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-xs text-slate-900"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="block text-xs font-bold text-slate-700">Tu municipio / ciudad</label>
                    <input
                      v-model="nodeForm.municipality"
                      type="text"
                      required
                      placeholder="Ej. Tunja, Neiva, Villavicencio..."
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-xs text-slate-900"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="block text-xs font-bold text-slate-700">Tu correo electrónico</label>
                    <input
                      v-model="nodeForm.email"
                      type="email"
                      required
                      placeholder="nombre@correo.com"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-emerald-700 focus:bg-white text-xs text-slate-900"
                    />
                  </div>
                </template>
              </div>

              <footer class="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  @click="isRequestModalOpen = false"
                  class="sg-landing-btn sg-landing-btn--secondary w-1/2 !min-h-[40px]"
                >
                  <span>{{ requestSuccess ? 'Cerrar' : 'Cancelar' }}</span>
                </button>

                <button
                  v-if="!requestSuccess"
                  type="submit"
                  class="sg-landing-btn sg-landing-btn--primary w-1/2 !min-h-[40px]"
                >
                  <span>Enviar solicitud</span>
                </button>
              </footer>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  MapPin,
  Star,
  Check,
  Building2,
  Clock,
  Phone,
  ArrowLeft,
  X,
  Gift
} from 'lucide-vue-next';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const props = defineProps({
  departments: {
    type: Array,
    required: true,
  },
  companies: {
    type: Array,
    required: true,
  },
});

const selectedDept = ref('Bogotá D.C.');
const selectedMuni = ref('');
const selectedMaterial = ref('');
const selectedCompany = ref(null);
const isRequestModalOpen = ref(false);
const requestSuccess = ref(false);

const nodeForm = reactive({
  department: '',
  municipality: '',
  email: '',
});

useBodyScrollLock(() => Boolean(selectedCompany.value || isRequestModalOpen.value));

const availableMunicipalities = computed(() => {
  if (!selectedDept.value) {
    const set = new Set();
    props.departments.forEach((d) => d.municipalities.forEach((m) => set.add(m)));
    return Array.from(set);
  }
  const match = props.departments.find((d) => d.name === selectedDept.value);
  return match ? match.municipalities : [];
});

function onDeptChange() {
  selectedMuni.value = '';
}

function resetFilters() {
  selectedDept.value = '';
  selectedMuni.value = '';
  selectedMaterial.value = '';
}

function scrollToRewards(e) {
  if (e) e.preventDefault();
  const el = document.getElementById('premios');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function openCompanyDetails(company) {
  selectedCompany.value = company;
}

function submitNodeRequest() {
  requestSuccess.value = true;
}

const filteredCompanies = computed(() => {
  return props.companies.filter((c) => {
    if (selectedDept.value && c.department !== selectedDept.value) {
      return false;
    }
    if (selectedMuni.value && c.municipality !== selectedMuni.value) {
      return false;
    }
    if (selectedMaterial.value && !c.materials.includes(selectedMaterial.value)) {
      return false;
    }
    return true;
  });
});
</script>

<style scoped>
.sg-modal-fade-enter-active,
.sg-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sg-modal-fade-enter-from,
.sg-modal-fade-leave-to {
  opacity: 0;
}
</style>
