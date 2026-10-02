<template>
  <div
    role="menu"
    aria-label="Reacciones"
    :class="[
      'flex items-center bg-white rounded-full shadow-lg border border-slate-200/90 z-50 animate-in fade-in zoom-in-95 duration-100 select-none',
      compact ? 'p-1 gap-1 -top-8' : 'p-1 sm:p-1.5 gap-1 -top-10'
    ]"
  >
    <button
      v-for="reaction in allReactions"
      :key="reaction.type"
      type="button"
      @click.stop="$emit('select', reaction.type)"
      class="flex items-center justify-center p-0.5 rounded-full transition-transform duration-150 hover:scale-115 focus:outline-none cursor-pointer"
    >
      <FacebookReactionIcon
        :type="reaction.type"
        :size="compact ? 'xs' : (size || 'sm')"
        class="transition-transform duration-100"
      />
    </button>
  </div>
</template>

<script setup>
import { useReactions } from '../composables/useReactions';
import FacebookReactionIcon from './FacebookReactionIcon.vue';

const props = defineProps({
  compact: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: 'xs',
  },
});

const { getAllReactions } = useReactions();
const allReactions = getAllReactions();

defineEmits(['select']);
</script>
