<template>
  <div class="flex items-center justify-between gap-1.5 sm:gap-2.5 w-full" @paste="handlePaste">
    <input
      v-for="(digit, idx) in digits"
      :key="idx"
      :ref="(el) => (inputRefs[idx] = el)"
      type="text"
      inputmode="numeric"
      maxlength="1"
      pattern="[0-9]*"
      :value="digit"
      @input="handleInput($event, idx)"
      @keydown="handleKeyDown($event, idx)"
      @focus="handleFocus($event)"
      class="w-10 h-12 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-bold bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 focus:outline-none transition-all selection:bg-emerald-600 selection:text-white shadow-2xs"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  length: {
    type: Number,
    default: 6,
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'complete']);

const digits = ref(Array(props.length).fill(''));
const inputRefs = ref([]);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      digits.value = Array(props.length).fill('');
      return;
    }
    const chars = val.slice(0, props.length).split('');
    digits.value = chars.concat(Array(Math.max(0, props.length - chars.length)).fill(''));
  },
  { immediate: true }
);

function handleInput(event, idx) {
  const value = event.target.value.replace(/[^0-9]/g, '');
  if (!value) {
    digits.value[idx] = '';
    emitChange();
    return;
  }

  digits.value[idx] = value.slice(-1);
  emitChange();

  if (idx < props.length - 1) {
    inputRefs.value[idx + 1]?.focus();
  }
}

function handleKeyDown(event, idx) {
  if (event.key === 'Backspace') {
    if (!digits.value[idx] && idx > 0) {
      digits.value[idx - 1] = '';
      emitChange();
      inputRefs.value[idx - 1]?.focus();
    } else {
      digits.value[idx] = '';
      emitChange();
    }
  } else if (event.key === 'ArrowLeft' && idx > 0) {
    inputRefs.value[idx - 1]?.focus();
  } else if (event.key === 'ArrowRight' && idx < props.length - 1) {
    inputRefs.value[idx + 1]?.focus();
  }
}

function handlePaste(event) {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text') || '';
  const cleanDigits = pasteData.replace(/[^0-9]/g, '').slice(0, props.length);
  if (!cleanDigits) return;

  const arr = cleanDigits.split('');
  for (let i = 0; i < props.length; i++) {
    digits.value[i] = arr[i] || '';
  }
  emitChange();

  const nextFocusIndex = Math.min(cleanDigits.length, props.length - 1);
  inputRefs.value[nextFocusIndex]?.focus();
}

function handleFocus(event) {
  event.target.select();
}

function emitChange() {
  const combined = digits.value.join('');
  emit('update:modelValue', combined);
  if (combined.length === props.length) {
    emit('complete', combined);
  }
}

onMounted(() => {
  inputRefs.value[0]?.focus();
});
</script>
