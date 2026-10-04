<template>
  <BaseModal
    :modelValue="modelValue"
    title="Editar información de perfil"
    size="lg"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <div class="p-4 sm:p-6 space-y-6">
      <!-- Section: Información personal -->
      <div class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">
          Datos personales
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Nombre completo</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Ciudad actual (Vive en)</label>
            <input
              v-model="form.location"
              type="text"
              placeholder="ej: Huston, Pennsylvania"
              class="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Ciudad de origen (De)</label>
            <input
              v-model="form.hometown"
              type="text"
              placeholder="ej: Sanfrancisco, Zulia, Venezuela"
              class="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Fecha de nacimiento</label>
            <input
              v-model="form.birthday"
              type="text"
              placeholder="ej: 26 de diciembre"
              class="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Género</label>
            <input
              v-model="form.gender"
              type="text"
              placeholder="ej: Hombre"
              class="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Pronombres</label>
            <input
              v-model="form.pronouns"
              type="text"
              placeholder="ej: masculino"
              class="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- Section: Empleo -->
      <div class="space-y-4 pt-4 border-t border-slate-100">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">
          Empleo y Educación
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Puesto / Empleo</label>
            <input
              v-model="form.work"
              type="text"
              placeholder="ej: Desarrollo de Software & Soluciones"
              class="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Especialidad / Rol</label>
            <input
              v-model="form.workRole"
              type="text"
              placeholder="ej: FullStack"
              class="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>

          <div class="sm:col-span-2 space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Periodo y Antigüedad</label>
            <input
              v-model="form.workDuration"
              type="text"
              placeholder="ej: Desde el 25 jul. 2020 hasta la fecha · 6 años y 2 meses"
              class="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>

          <div class="sm:col-span-2 space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Formación académica</label>
            <input
              v-model="form.education"
              type="text"
              placeholder="ej: Universidad Nacional de Colombia"
              class="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- Section: Seguridad y 2FA -->
      <div class="space-y-4 pt-4 border-t border-slate-100">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">
          Seguridad de la cuenta
        </h3>

        <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div class="space-y-0.5 pr-4">
            <span class="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Autenticación en dos pasos (2FA)</span>
              <span v-if="form.twoFactorEnabled" class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Activo
              </span>
            </span>
            <p class="text-xs text-slate-500">
              Solicitar siempre un código OTP de 6 dígitos al iniciar sesión.
            </p>
          </div>

          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              v-model="form.twoFactorEnabled"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            />
          </label>
        </div>
      </div>
    </div>

    <template #actions>
      <div class="flex items-center justify-end gap-2.5 w-full">
        <button
          type="button"
          @click="$emit('update:modelValue', false)"
          class="px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="saveChanges"
          class="px-5 py-2 text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-xs transition-colors cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, watch } from 'vue';
import BaseModal from '@/shared/components/BaseModal.vue';
import { useAuthStore } from '@/modules/auth/stores/useAuth.store';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'save']);
const authStore = useAuthStore();

const form = reactive({
  name: props.user.name || '',
  location: props.user.location || 'Huston, Pennsylvania',
  hometown: props.user.hometown || 'Sanfrancisco, Zulia, Venezuela',
  birthday: props.user.birthday || '26 de diciembre',
  gender: props.user.gender || 'Hombre',
  pronouns: props.user.pronouns || 'masculino',
  work: props.user.work || 'Desarrollo de Software',
  workRole: props.user.workRole || 'FullStack',
  workDuration: props.user.workDuration || 'Desde el 25 jul. 2020 hasta la fecha · 6 años y 2 meses',
  education: props.user.education || 'Universidad Nacional de Colombia',
  twoFactorEnabled: props.user.twoFactorEnabled ?? true,
});

watch(
  () => props.user,
  (u) => {
    if (u) {
      form.name = u.name || '';
      form.location = u.location || 'Huston, Pennsylvania';
      form.hometown = u.hometown || 'Sanfrancisco, Zulia, Venezuela';
      form.birthday = u.birthday || '26 de diciembre';
      form.gender = u.gender || 'Hombre';
      form.pronouns = u.pronouns || 'masculino';
      form.work = u.work || 'Desarrollo de Software';
      form.workRole = u.workRole || 'FullStack';
      form.workDuration = u.workDuration || 'Desde el 25 jul. 2020 hasta la fecha · 6 años y 2 meses';
      form.education = u.education || 'Universidad Nacional de Colombia';
      form.twoFactorEnabled = u.twoFactorEnabled ?? true;
    }
  },
  { deep: true, immediate: true }
);

function saveChanges() {
  authStore.toggleTwoFactor(form.twoFactorEnabled, props.user?.email);
  emit('save', { ...form });
  emit('update:modelValue', false);
}
</script>
