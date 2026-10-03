<template>
  <div class="sg-select-container" ref="containerRef">
    <label v-if="label" class="sg-select-label">
      {{ label }} <span v-if="required" class="sg-select-label__req">*</span>
    </label>

    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      :class="[
        'sg-select-trigger',
        isOpen && 'sg-select-trigger--open',
        !modelValue && 'sg-select-trigger--placeholder'
      ]"
    >
      <span class="truncate">
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronUp v-if="isOpen" class="w-4 h-4 text-slate-400 shrink-0 ml-1" />
      <ChevronDown v-else class="w-4 h-4 text-slate-400 shrink-0 ml-1" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="sg-select-dropdown animate-in fade-in zoom-in-95 duration-100"
    >
      <!-- Search Input inside dropdown -->
      <div class="sg-select-search-box">
        <div class="sg-select-search-input-wrap">
          <Search class="sg-select-search-icon" />
          <input
            ref="searchInputRef"
            type="text"
            v-model="searchQuery"
            placeholder="Buscar..."
            class="sg-select-search-input"
          />
        </div>
      </div>

      <!-- Options List -->
      <div class="sg-select-options-list">
        <!-- Reset / Placeholder Option -->
        <button
          type="button"
          @click="selectOption('')"
          class="sg-select-option sg-select-option--reset"
        >
          <span class="truncate">{{ placeholder }}</span>
          <Check v-if="!modelValue" class="w-4 h-4 shrink-0" />
        </button>

        <!-- Dynamic Options -->
        <button
          v-for="opt in filteredOptions"
          :key="opt.value"
          type="button"
          @click="selectOption(opt.value)"
          :class="[
            'sg-select-option',
            modelValue === opt.value && 'sg-select-option--selected'
          ]"
        >
          <span class="truncate">{{ opt.label }}</span>
          <Check v-if="modelValue === opt.value" class="w-4 h-4 shrink-0" />
        </button>

        <!-- Empty State -->
        <div v-if="filteredOptions.length === 0" class="sg-select-empty">
          No se encontraron resultados
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
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
    default: 'Selecciona una opción...',
  },
  options: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const searchQuery = ref('');
const containerRef = ref(null);
const searchInputRef = ref(null);

const normalizedOptions = computed(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return {
      value: opt.value ?? opt.id ?? opt.name,
      label: opt.label ?? opt.name ?? opt.value,
    };
  });
});

const selectedLabel = computed(() => {
  const found = normalizedOptions.value.find((o) => o.value === props.modelValue);
  return found ? found.label : '';
});

const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) return normalizedOptions.value;
  const q = searchQuery.value.toLowerCase().trim();
  return normalizedOptions.value.filter((o) =>
    o.label.toLowerCase().includes(q)
  );
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
  emit('change', val);
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

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
