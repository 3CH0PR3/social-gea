<template>
  <div class="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
    <div class="grid grid-cols-1 md:grid-cols-12 min-h-96">
      <!-- Left Sub-navigation (Facebook Style as in screenshot) -->
      <div class="md:col-span-4 lg:col-span-3 border-r border-slate-200/80 p-4 space-y-1 bg-slate-50/40">
        <h3 class="font-extrabold text-slate-900 text-lg font-display px-3 py-2 mb-1">
          Información
        </h3>

        <button
          v-for="tab in infoTabs"
          :key="tab.id"
          type="button"
          @click="activeSubTab = tab.id"
          :class="[
            'w-full text-left px-3.5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer',
            activeSubTab === tab.id
              ? 'bg-blue-50 text-blue-700 font-bold'
              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
          ]"
        >
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Right Content Panel -->
      <div class="md:col-span-8 lg:col-span-9 p-6 sm:p-8 space-y-6">
        <!-- 1. DATOS PERSONALES -->
        <div v-if="activeSubTab === 'personal'" class="space-y-6 animate-in fade-in duration-150">
          <!-- Ubicación -->
          <div class="space-y-1.5 pb-4 border-b border-slate-100">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ubicación
            </h4>
            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <MapPin class="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h5 class="text-sm sm:text-base font-bold text-blue-600 hover:underline cursor-pointer">
                    {{ user.location || 'Colombia' }}
                  </h5>
                  <p class="text-xs text-slate-400">Ciudad actual</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Globe class="w-4 h-4 text-slate-400" title="Público" />
                <!-- Edit button ONLY on own profile -->
                <button
                  v-if="isOwnProfile"
                  type="button"
                  @click="$emit('edit-profile')"
                  class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Editar ubicación"
                >
                  <Edit3 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Ciudad de origen -->
          <div class="space-y-1.5 pb-4 border-b border-slate-100">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ciudad de origen
            </h4>
            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <Home class="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h5 class="text-sm sm:text-base font-bold text-blue-600 hover:underline cursor-pointer">
                    {{ user.hometown || 'Colombia' }}
                  </h5>
                  <p class="text-xs text-slate-400">Ciudad de origen</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Globe class="w-4 h-4 text-slate-400" title="Público" />
                <!-- Edit button ONLY on own profile -->
                <button
                  v-if="isOwnProfile"
                  type="button"
                  @click="$emit('edit-profile')"
                  class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Editar ciudad de origen"
                >
                  <Edit3 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Fecha de nacimiento -->
          <div class="space-y-1.5 pb-4 border-b border-slate-100">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fecha de nacimiento
            </h4>
            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <Gift class="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h5 class="text-sm sm:text-base font-bold text-slate-800">
                    {{ user.birthday || '26 de diciembre' }}
                  </h5>
                  <p class="text-xs text-slate-400">Fecha de nacimiento</p>
                  <p class="text-xs font-semibold text-slate-700 mt-1">2000</p>
                  <p class="text-[11px] text-slate-400">Año de nacimiento</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1 text-slate-400">
                  <Users class="w-3.5 h-3.5" title="Amigos" />
                  <Lock class="w-3.5 h-3.5 ml-1" title="Solo yo" />
                </div>
                <!-- Edit button ONLY on own profile -->
                <button
                  v-if="isOwnProfile"
                  type="button"
                  @click="$emit('edit-profile')"
                  class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Editar fecha de nacimiento"
                >
                  <Edit3 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Situación sentimental -->
          <div class="space-y-1.5 pb-4 border-b border-slate-100">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Situación sentimental
            </h4>
            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <Heart class="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h5 class="text-sm sm:text-base font-bold text-slate-800">
                    Soltero(a)
                  </h5>
                  <p class="text-xs text-slate-400">Estado</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Globe class="w-4 h-4 text-slate-400" title="Público" />
                <!-- Edit button ONLY on own profile -->
                <button
                  v-if="isOwnProfile"
                  type="button"
                  @click="$emit('edit-profile')"
                  class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Editar situación sentimental"
                >
                  <Edit3 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Género -->
          <div class="space-y-1.5 pb-4">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Género
            </h4>
            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <User class="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h5 class="text-sm sm:text-base font-bold text-slate-800">
                    Masculino
                  </h5>
                  <p class="text-xs text-slate-400">Género</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Globe class="w-4 h-4 text-slate-400" title="Público" />
                <!-- Edit button ONLY on own profile -->
                <button
                  v-if="isOwnProfile"
                  type="button"
                  @click="$emit('edit-profile')"
                  class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Editar género"
                >
                  <Edit3 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. EMPLEO TAB -->
        <div v-else-if="activeSubTab === 'work'" class="space-y-6 animate-in fade-in duration-150">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 class="text-sm font-bold text-slate-900 font-display">Empleo</h4>
            <!-- Add employment ONLY on own profile -->
            <button
              v-if="isOwnProfile"
              type="button"
              @click="$emit('edit-profile')"
              class="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus class="w-4 h-4" />
              <span>Agregar empleo</span>
            </button>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-md border border-slate-200/80 bg-slate-50/50">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-slate-900 shrink-0">
              <SafeImage
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80"
                alt="Empresa"
                imgClass="w-full h-full object-cover"
                containerClass="w-full h-full"
              />
            </div>
            <div class="space-y-1 flex-1">
              <h5 class="text-sm font-bold text-slate-900 leading-snug">
                {{ user.work || 'Profesional en Socialgea' }}
              </h5>
              <p class="text-xs text-slate-600 font-medium">Cargo: {{ user.workRole || 'Especialista' }}</p>
              <p class="text-xs text-slate-400">
                {{ user.workDuration || 'Desde el 25 jul. 2020 hasta la fecha · 6 años y 2 meses' }}
              </p>
            </div>
            <!-- Edit button ONLY on own profile -->
            <button
              v-if="isOwnProfile"
              type="button"
              @click="$emit('edit-profile')"
              class="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <Edit3 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 3. FORMACIÓN ACADÉMICA -->
        <div v-else-if="activeSubTab === 'education'" class="space-y-6 animate-in fade-in duration-150">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 class="text-sm font-bold text-slate-900 font-display">Universidad y Estudios</h4>
            <!-- Add education ONLY on own profile -->
            <button
              v-if="isOwnProfile"
              type="button"
              @click="$emit('edit-profile')"
              class="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus class="w-4 h-4" />
              <span>Agregar universidad</span>
            </button>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-md border border-slate-200/80 bg-slate-50/50">
            <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <GraduationCap class="w-6 h-6" />
            </div>
            <div class="space-y-1 flex-1">
              <h5 class="text-sm font-bold text-slate-900 leading-snug">
                {{ user.education || 'Universidad Nacional' }}
              </h5>
              <p class="text-xs text-slate-600 font-medium">Educación Superior</p>
              <p class="text-xs text-slate-400">Graduado</p>
            </div>
            <!-- Edit button ONLY on own profile -->
            <button
              v-if="isOwnProfile"
              type="button"
              @click="$emit('edit-profile')"
              class="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <Edit3 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 4. DETALLES GENERALES / RESUMEN -->
        <div v-else class="space-y-4 animate-in fade-in duration-150">
          <div class="border-b border-slate-100 pb-3">
            <h4 class="text-sm font-bold text-slate-900 font-display">Información General</h4>
          </div>

          <div class="space-y-3 text-xs sm:text-sm text-slate-700">
            <div class="flex items-center gap-3">
              <MapPin class="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span>Vive en <strong class="text-slate-900">{{ user.location || 'Colombia' }}</strong></span>
            </div>

            <div class="flex items-center gap-3">
              <Home class="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span>De <strong class="text-slate-900">{{ user.hometown || 'Colombia' }}</strong></span>
            </div>

            <div class="flex items-center gap-3">
              <Gift class="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span>Nació el <strong class="text-slate-900">{{ user.birthday || '26 de diciembre' }}</strong></span>
            </div>

            <div class="flex items-center gap-3">
              <Users class="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span>{{ user.friendsCount || 468 }} amigos en Socialgea</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  MapPin,
  Home,
  Gift,
  Heart,
  Users,
  User,
  Globe,
  Lock,
  Edit3,
  Plus,
  GraduationCap
} from 'lucide-vue-next';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit-profile']);

const feedStore = useFeedStore();

const isOwnProfile = computed(() => {
  const currentId = feedStore.currentUser.id;
  return props.user.id === currentId || props.user.id === 'user_current';
});

const activeSubTab = ref('personal');

const infoTabs = [
  { id: 'personal', label: 'Datos personales' },
  { id: 'work', label: 'Empleo' },
  { id: 'education', label: 'Formación académica' },
  { id: 'details', label: 'Detalles' },
];
</script>
