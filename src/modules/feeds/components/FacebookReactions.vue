<template>
  <div
    role="menu"
    aria-label="Reacciones"
    class="flex items-center bg-white rounded-full shadow-2xl border border-slate-200/90 py-1.5 px-2.5 sm:px-3 gap-1.5 sm:gap-2 z-50 animate-in fade-in zoom-in-95 duration-150 select-none"
  >
    <button
      v-for="reaction in allReactions"
      :key="reaction.type"
      type="button"
      @click.stop="$emit('select', reaction.type)"
      class="group relative flex items-center justify-center p-1 rounded-full transition-all duration-150 hover:scale-130 hover:-translate-y-1.5 focus:outline-none cursor-pointer"
      :title="reaction.label"
    >
      <FacebookReactionIcon
        :type="reaction.type"
        size="md"
        class="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm"
      />
      <!-- Tooltip label on hover -->
      <span class="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/90 text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
        {{ reaction.label }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { useReactions } from '../composables/useReactions';
import FacebookReactionIcon from './FacebookReactionIcon.vue';

defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const { getAllReactions } = useReactions();
const allReactions = getAllReactions();

defineEmits(['select']);
</script>
