<template>
  <div
    v-if="isOpen"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-[2px] animate-in fade-in duration-150"
    @click="$emit('close')"
  >
    <div
      class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-150"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 select-none">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-slate-800 text-base">Reacciones</span>
          <span class="text-xs text-slate-500 font-medium">({{ totalReactions }})</span>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-1 px-4 py-2 border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50 select-none">
        <button
          @click="selectedFilter = 'all'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer',
            selectedFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
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
            'px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer',
            selectedFilter === type
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          ]"
        >
          <FacebookReactionIcon :type="type" size="xs" />
          <span class="text-[11px] font-bold">{{ post.reactions[type] }}</span>
        </button>
      </div>

      <!-- User List (Delimited to exactly 5 visible items with smooth infinite scroll) -->
      <div
        ref="listContainerRef"
        @scroll="handleScroll"
        class="h-[275px] max-h-[275px] overflow-y-auto p-3 space-y-1"
      >
        <div v-if="visibleList.length === 0" class="text-center py-12 text-slate-400 text-sm">
          No hay reacciones en esta categoría aún.
        </div>

        <div
          v-for="item in visibleList"
          :key="item.userId"
          class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div
            class="flex items-center gap-3 cursor-pointer min-w-0"
            @click="navigateToUser(item.userId)"
          >
            <div class="relative shrink-0">
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
            <div class="min-w-0">
              <h4 class="text-sm font-semibold text-slate-800 hover:underline truncate">
                {{ item.userName }}
              </h4>
              <p class="text-[11px] text-slate-500 font-medium capitalize">
                {{ REACTION_CONFIGS[item.type]?.label || item.type }}
              </p>
            </div>
          </div>

          <!-- Current user shows "Tú", other users show "Conectar" -->
          <div v-if="isCurrentUser(item)" class="px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-xs select-none">
            Tú
          </div>
          <button
            v-else
            type="button"
            @click="toggleConnect(item.userId)"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer',
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

        <!-- Subtle loading indicator while scrolling and fetching more -->
        <div v-if="isLoadingMore" class="py-2.5 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <div class="w-3.5 h-3.5 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
          <span>Cargando más personas...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { X, UserPlus, Check } from 'lucide-vue-next';
import { REACTION_CONFIGS } from '../composables/useReactions';
import FacebookReactionIcon from './FacebookReactionIcon.vue';
import SafeImage from '@/shared/components/SafeImage.vue';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import { useFeedStore } from '../store/feedStore';
import { COMMUNITY_USERS } from '@/shared/data/initialData';

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
const feedStore = useFeedStore();

const listContainerRef = ref(null);
const selectedFilter = ref('all');
const connectedUserIds = ref([]);
const visibleLimit = ref(5);
const isLoadingMore = ref(false);

const totalReactions = computed(() => {
  return Object.values(props.post.reactions || {}).reduce((acc, v) => acc + v, 0);
});

const activeTypes = computed(() => {
  return Object.keys(props.post.reactions || {}).filter((k) => props.post.reactions[k] > 0);
});

// Comprehensive list combining real post/comment reactions + fallback community pool
const fullPool = computed(() => {
  const list = [...(props.post.reactionsList || [])];

  // If user reacted but isn't in reactionsList yet, ensure currentUser is at top!
  if (props.post.userReaction && !list.some((r) => isCurrentUser(r))) {
    list.unshift({
      userId: feedStore.currentUser.id,
      userName: feedStore.currentUser.name,
      userAvatar: feedStore.currentUser.avatar,
      type: props.post.userReaction,
    });
  }

  // Populate extra peers from community pool to allow infinite scrolling experience
  const extraPeers = [
    { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', type: 'love', userId: 'user_1' },
    { name: 'Alejandro Morales', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', type: 'like', userId: 'user_2' },
    { name: 'Sofía Valenzuela', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', type: 'care', userId: 'user_3' },
    { name: 'Marcos Benítez', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', type: 'like', userId: 'user_4' },
    { name: 'Valentina Silva', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', type: 'haha', userId: 'user_5' },
    { name: 'David Gómez', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', type: 'like', userId: 'user_6' },
    { name: 'Camila Torres', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', type: 'love', userId: 'user_7' },
    { name: 'Andrés Herrera', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', type: 'wow', userId: 'user_8' },
    { name: 'Lucía Navarro', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', type: 'care', userId: 'user_9' },
    { name: 'Javier Santos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', type: 'angry', userId: 'user_10' },
  ];

  extraPeers.forEach((p) => {
    if (!list.some((l) => l.userName === p.name || l.userId === p.userId)) {
      list.push({ ...p, userName: p.name, userAvatar: p.avatar });
    }
  });

  return list;
});

const filteredList = computed(() => {
  if (selectedFilter.value === 'all') return fullPool.value;
  return fullPool.value.filter((it) => it.type === selectedFilter.value);
});

// Limited to 5 initial items, expands as user scrolls down (pagination)
const visibleList = computed(() => {
  return filteredList.value.slice(0, visibleLimit.value);
});

function handleScroll(e) {
  const el = e.target;
  if (!el || isLoadingMore.value) return;

  // When scrolled near bottom, load next batch of 5 items
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 30) {
    if (visibleLimit.value < filteredList.value.length) {
      isLoadingMore.value = true;
      setTimeout(() => {
        visibleLimit.value += 5;
        isLoadingMore.value = false;
      }, 400);
    }
  }
}

watch(selectedFilter, () => {
  visibleLimit.value = 5;
  if (listContainerRef.value) {
    listContainerRef.value.scrollTop = 0;
  }
});

function isCurrentUser(item) {
  const me = feedStore.currentUser;
  return item.userId === me.id || item.userName === me.name;
}

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
