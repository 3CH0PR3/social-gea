<template>
  <Teleport to="body">
    <div v-if="isOpen">
      <!-- Backdrop overlay -->
      <div
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        @click="$emit('close')"
      />

      <!-- Bottom Sheet Drawer -->
      <div
        role="dialog"
        aria-modal="true"
        class="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-slate-200/90 max-w-lg mx-auto overflow-hidden animate-in slide-in-from-bottom duration-200 select-none pb-safe"
      >
        <!-- Pull Handle -->
        <div class="py-2.5 flex items-center justify-center">
          <div class="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        <!-- Options list -->
        <div class="p-3 space-y-1">
          <button
            type="button"
            @click="handleRemoveFriend"
            class="w-full p-3.5 rounded-xl hover:bg-slate-100 flex items-center gap-3.5 text-left text-slate-800 transition-colors cursor-pointer"
          >
            <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <UserX class="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 leading-snug">
                Eliminar de amigos
              </h4>
              <p class="text-xs text-slate-500">
                Eliminar a {{ user.name }} de tu lista de amigos
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { UserX } from 'lucide-vue-next';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'remove-friend']);

useBodyScrollLock(() => props.isOpen);

function handleRemoveFriend() {
  emit('remove-friend', props.user.id);
  emit('close');
}
</script>
