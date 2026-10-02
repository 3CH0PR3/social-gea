<template>
  <div
    role="menu"
    aria-label="Reacciones de Facebook"
    class="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-white rounded-full shadow-2xl border border-slate-200/90 z-50 animate-in fade-in zoom-in-95 duration-150"
  >
    <button
      v-for="reaction in allReactions"
      :key="reaction.type"
      type="button"
      @click.stop="$emit('select', reaction.type)"
      class="group relative flex flex-col items-center justify-center p-1 rounded-full transition-transform duration-200 hover:scale-135 hover:-translate-y-2 focus:outline-none cursor-pointer"
      :title="reaction.label"
    >
      <FacebookReactionIcon
        :type="reaction.type"
        size="lg"
      />

      <span class="absolute -top-7 scale-0 group-hover:scale-100 transition-all duration-150 bg-slate-900/90 text-white text-[11px] font-medium py-0.5 px-2 rounded-full whitespace-nowrap pointer-events-none shadow-md">
        {{ reaction.label }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { useReactions } from '../composables/useReactions';
import FacebookReactionIcon from './FacebookReactionIcon.vue';

const { getAllReactions } = useReactions();
const allReactions = getAllReactions();

defineEmits(['select']);
</script>
