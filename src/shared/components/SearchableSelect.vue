<template>
  <div class="relative w-full" ref="containerRef">
    <label v-if="label" class="block text-xs font-semibold text-slate-700 mb-1">
      {{ label }} <span v-if="required" class="text-rose-500">*</span>
    </label>

    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      :class="[
        'w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer bg-white',
        isOpen
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 text-slate-800'
          : 'border-slate-200/90 hover:border-slate-300 text-slate-700',
        !modelValue && 'text-slate-400'
      ]"
    >
      <span class="truncate">
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronUp v-if="isOpen" class="w-4 h-4 text-slate-400 shrink-0 ml-1" />
      <ChevronDown v-else class="w-4 h-4 text-slate-400 shrink-0 ml-1" />
    </button>

    <!-- Dropdown Menu (Matches Screenshot 2, 3, 4) -->
    <div
      v-if="isOpen"
      class="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
    >
      <!-- Search Input inside dropdown -->
      <div class="p-2 border-b border-slate-100">
        <div class="relative flex items-center">
          <Search class="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            ref="searchInputRef"
            type="text"
            v-model="searchQuery"
            placeholder="Buscar..."
            class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-indigo-300 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-slate-800"
          />
        </div>
      </div>

      <!-- Options List -->
      <div class="max-h-52 overflow-y-auto py-1">
        <!-- Reset / Placeholder Option -->
        <button
          type="button"
          @click="selectOption('')"
          class="w-full px-3.5 py-2 text-xs text-left text-indigo-600 hover:bg-slate-50 flex items-center justify-between font-medium cursor-pointer"
        >
          <span class="truncate">{{ placeholder }}</span>
          <Check v-if="!modelValue" class="w-4 h-4 text-indigo-600 shrink-0" />
        </button>

        <!-- Dynamic Options -->
        <button
          v-for="opt in filteredOptions"
          :key="opt.value"
          type="button"
          @click="selectOption(opt.value)"
          :class="[
            'w-full px-3.5 py-2 text-xs text-left flex items-center justify-between transition-colors cursor-pointer',
            modelValue === opt.value
              ? 'bg-indigo-50/70 text-indigo-900 font-semibold'
              : 'text-slate-700 hover:bg-slate-50'
          ]"
        >
          <span class="truncate">{{ opt.label }}</span>
          <Check v-if="modelValue === opt.value" class="w-4 h-4 text-indigo-600 shrink-0" />
        </button>

        <div v-if="filteredOptions.length === 0" class="px-3.5 py-3 text-center text-xs text-slate-400">
          No se encontraron opciones
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { ChevronDown, ChevronUp, Search, Check } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Seleccione una opción',
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const containerRef = ref(null);
const searchInputRef = ref(null);
const isOpen = ref(false);
const searchQuery = ref('');

const selectedLabel = computed(() => {
  const found = props.options.find((o) => o.value === props.modelValue);
  return found ? found.label : '';
});

const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) return props.options;
  const q = searchQuery.value.toLowerCase();
  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = '';
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
}

function selectOption(val) {
  emit('update:modelValue', val);
  isOpen.value = false;
  searchQuery.value = '';
}

function handleClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
