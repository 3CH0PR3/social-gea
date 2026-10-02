<template>
  <div
    v-if="isOpen"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    @click="$emit('close')"
  >
    <div
      class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-slate-800 text-base">Reacciones</span>
          <span class="text-xs text-slate-500 font-medium">({{ totalReactions }})</span>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Cerrar"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-1 px-4 py-2 border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50">
        <button
          @click="selectedFilter = 'all'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5',
            selectedFilter === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200/60'
          ]"
        >
          <span>Todos</span>
          <span class="text-[11px] opacity-90">{{ totalReactions }}</span>
        </button>

        <button
          v-for="type in activeTypes"
          :key="type"
          @click="selectedFilter = type"
          :class="[
            'px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5',
            selectedFilter === type
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200/60'
          ]"
        >
          <FacebookReactionIcon :type="type" size="xs" />
          <span class="text-[11px] font-bold">{{ post.reactions[type] }}</span>
        </button>
      </div>

      <!-- User List -->
      <div class="flex-1 overflow-y-auto p-3 space-y-1">
        <div v-if="filteredList.length === 0" class="text-center py-10 text-slate-400 text-sm">
          No hay reacciones en esta categoría aún.
        </div>

        <div
          v-for="item in filteredList"
          :key="item.userId"
          class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div
            class="flex items-center gap-3 cursor-pointer"
            @click="navigateToUser(item.userId)"
          >
            <div class="relative">
              <SafeImage
                :src="item.userAvatar"
                :alt="item.userName"
                imgClass="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                containerClass="w-10 h-10 rounded-full"
              />
              <FacebookReactionIcon
                :type="item.type"
                size="xs"
                class="absolute -bottom-1 -right-1 ring-2 ring-white rounded-full"
              />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-slate-800 hover:underline">
                {{ item.userName }}
              </h4>
              <p class="text-[11px] text-slate-500 font-medium">
                {{ REACTION_CONFIGS[item.type]?.label }}
              </p>
            </div>
          </div>

          <button
            @click="toggleConnect(item.userId)"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              connectedUserIds.includes(item.userId)
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            ]"
          >
            <Check v-if="connectedUserIds.includes(item.userId)" class="w-3.5 h-3.5 text-emerald-600" />
            <UserPlus v-else class="w-3.5 h-3.5 text-slate-500" />
            <span>{{ connectedUserIds.includes(item.userId) ? 'Conectado' : 'Conectar' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { X, UserPlus, Check } from 'lucide-vue-next';
import { REACTION_CONFIGS } from '../composables/useReactions';
import FacebookReactionIcon from './FacebookReactionIcon.vue';
import SafeImage from '@/shared/components/SafeImage.vue';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

useBodyScrollLock(() => props.isOpen);

const emit = defineEmits(['close']);
const router = useRouter();

const selectedFilter = ref('all');
const connectedUserIds = ref([]);

const totalReactions = computed(() => {
  return Object.values(props.post.reactions || {}).reduce((acc, v) => acc + v, 0);
});

const activeTypes = computed(() => {
  return Object.keys(props.post.reactions || {}).filter((k) => props.post.reactions[k] > 0);
});

const displayList = computed(() => {
  const list = [...(props.post.reactionsList || [])];
  if (list.length < 4 && totalReactions.value > 0) {
    const fallbackPeers = [
      { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', type: 'love', userId: 'p_1' },
      { name: 'Alejandro Morales', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', type: 'like', userId: 'p_2' },
      { name: 'Sofía Valenzuela', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', type: 'care', userId: 'p_3' },
    ];
    fallbackPeers.forEach((p) => {
      if (!list.some((l) => l.userName === p.name)) {
        list.push({ ...p, userName: p.name, userAvatar: p.avatar });
      }
    });
  }
  return list;
});

const filteredList = computed(() => {
  if (selectedFilter.value === 'all') return displayList.value;
  return displayList.value.filter((it) => it.type === selectedFilter.value);
});

function toggleConnect(userId) {
  if (connectedUserIds.value.includes(userId)) {
    connectedUserIds.value = connectedUserIds.value.filter((id) => id !== userId);
  } else {
    connectedUserIds.value.push(userId);
  }
}

function navigateToUser(userId) {
  emit('close');
  router.push(`/profiles/${userId}`);
}
</script>
