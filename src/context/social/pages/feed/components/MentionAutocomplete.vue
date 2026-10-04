<template>
  <div
    v-if="isOpen && filteredUsers.length > 0"
    class="absolute bottom-full left-2 sm:left-4 mb-2 w-72 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 select-none"
  >
    <div class="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
      <span>Mencionar a un miembro</span>
      <span class="text-[10px] text-emerald-600 font-semibold">@conecta</span>
    </div>

    <div class="max-h-52 overflow-y-auto py-1">
      <button
        v-for="(user, idx) in filteredUsers"
        :key="user.id"
        type="button"
        @click="$emit('select', user)"
        :class="[
          'w-full px-3 py-2 text-left flex items-center gap-2.5 transition-colors cursor-pointer',
          selectedIndex === idx ? 'bg-indigo-50/80 text-indigo-950' : 'hover:bg-slate-50 text-slate-800'
        ]"
      >
        <SafeImage
          :src="user.avatar"
          :alt="user.name"
          imgClass="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
          containerClass="w-8 h-8 rounded-full"
        />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold truncate">{{ user.name }}</span>
            <span v-if="user.isFriend" class="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded">Amigo</span>
          </div>
          <span class="text-[11px] text-slate-400 block truncate">@{{ user.username }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { COMMUNITY_USERS, CURRENT_USER } from '@/shared/data/initialData';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  searchQuery: {
    type: String,
    default: '',
  },
  selectedIndex: {
    type: Number,
    default: 0,
  },
});

defineEmits(['select']);

const allUsers = [CURRENT_USER, ...COMMUNITY_USERS];

const filteredUsers = computed(() => {
  const q = (props.searchQuery || '').trim().toLowerCase();
  if (!q) return allUsers;
  return allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
  );
});
</script>
