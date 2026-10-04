<template>
  <Teleport to="body" :disabled="isDesktop">
    <div v-if="isOpen">
      <!-- ========================================================
           1. ANDROID / MOBILE COMPONENT:
           Full-screen viewport (100dvh), adapted to Conecta Radar's clean light theme.
           ======================================================== -->
      <div
        v-if="!isDesktop"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col h-[100dvh] w-full overflow-hidden select-none animate-in slide-in-from-bottom duration-200"
      >
        <!-- Top App Bar (Back Arrow, Title "Reacciones", Search Button) -->
        <div class="px-3.5 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 sticky top-0 z-20">
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="p-2 -ml-1 text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors cursor-pointer"
              aria-label="Volver"
            >
              <ArrowLeft class="w-5 h-5 stroke-[2.2]" />
            </button>
            <div class="flex items-center gap-1.5">
              <h3 class="text-base font-bold text-slate-900 tracking-tight font-display">Reacciones</h3>
              <span class="text-xs text-slate-500 font-semibold">({{ totalReactions }})</span>
            </div>
          </div>

          <button
            type="button"
            @click="showSearch = !showSearch"
            :class="[
              'p-2 rounded-full transition-colors cursor-pointer',
              showSearch ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
            ]"
            title="Buscar persona"
            aria-label="Buscar persona"
          >
            <Search class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Search Bar (Toggleable on mobile) -->
        <div v-if="showSearch" class="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 shrink-0 animate-in fade-in duration-100">
          <div class="flex-1 flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <Search class="w-4 h-4 text-slate-400 shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nombre..."
              class="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none"
              autofocus
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="p-0.5 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Category Filter Tabs Bar (Horizontal pills matching Conecta Radar theme) -->
        <div class="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/70 shrink-0">
          <!-- Todas tab -->
          <button
            type="button"
            @click="selectedFilter = 'all'"
            :class="[
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5',
              selectedFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
            ]"
          >
            <span>Todas</span>
            <span :class="['text-[11px]', selectedFilter === 'all' ? 'text-emerald-100' : 'text-slate-500 font-semibold']">
              {{ totalReactions }}
            </span>
          </button>

          <!-- Specific Reaction Tabs (Like, Love, Care, Haha, etc.) -->
          <button
            v-for="type in availableReactionTypes"
            :key="type"
            type="button"
            @click="selectedFilter = type"
            :class="[
              'px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5',
              selectedFilter === type
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
            ]"
          >
            <FacebookReactionIcon :type="type" size="xs" class="w-3.5 h-3.5" />
            <span :class="['text-[11px]', selectedFilter === type ? 'text-emerald-100' : 'text-slate-600 font-semibold']">
              {{ getReactionCount(type) }}
            </span>
          </button>
        </div>

        <!-- Reacted Users List (Theme-consistent light style with connection details) -->
        <div class="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-0.5">
          <div v-if="filteredList.length === 0" class="text-center py-20 text-slate-400 text-xs sm:text-sm">
            No se encontraron reacciones en esta sección.
          </div>

          <div
            v-for="user in filteredList"
            :key="user.userId"
            class="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <!-- User Info (Avatar with overlapping reaction badge + Name & Connection subtitle) -->
            <div
              class="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
              @click="navigateToUser(user.userId)"
            >
              <div class="relative shrink-0">
                <SafeImage
                  :src="user.userAvatar"
                  :alt="user.userName"
                  imgClass="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  containerClass="w-10 h-10 rounded-full bg-slate-100"
                />
                <!-- Reaction Badge at bottom-right of avatar -->
                <FacebookReactionIcon
                  :type="user.type"
                  size="xs"
                  class="absolute -bottom-1 -right-1 w-4 h-4 ring-2 ring-white rounded-full drop-shadow-xs"
                />
              </div>

              <div class="min-w-0 flex-1">
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-600 hover:underline truncate">
                  {{ user.userName }}
                </h4>
                <p class="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                  {{ user.subtitle || 'Amigo en común' }}
                </p>
              </div>
            </div>

            <!-- Follow / Friend status badge on mobile -->
            <div v-if="isCurrentUser(user)" class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-[11px] shrink-0 select-none">
              Tú
            </div>
            <button
              v-else
              type="button"
              @click="toggleConnect(user.userId)"
              :class="[
                'flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer select-none',
                connectedUserIds.includes(user.userId)
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              ]"
            >
              <Check v-if="connectedUserIds.includes(user.userId)" class="w-3.5 h-3.5 text-emerald-700" />
              <UserPlus v-else class="w-3.5 h-3.5 text-white" />
              <span>{{ connectedUserIds.includes(user.userId) ? 'Amigos' : 'Agregar amigo' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ========================================================
           2. DESKTOP MODAL (Preserved for desktop: clean light popup modal)
           ======================================================== -->
      <div
        v-else
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-150"
        @click="$emit('close')"
      >
        <div
          class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-150"
          @click.stop
        >
          <!-- Desktop Header -->
          <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 select-none">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-800 text-base">Reacciones</span>
              <span class="text-xs text-slate-500 font-semibold">({{ totalReactions }})</span>
            </div>
            <button
              type="button"
              @click="$emit('close')"
              class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Desktop Filter Tabs -->
          <div class="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/60 select-none">
            <button
              type="button"
              @click="selectedFilter = 'all'"
              :class="[
                'px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer',
                selectedFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              ]"
            >
              <span>Todos</span>
              <span class="text-[11px] opacity-90">{{ totalReactions }}</span>
            </button>

            <button
              v-for="type in availableReactionTypes"
              :key="type"
              type="button"
              @click="selectedFilter = type"
              :class="[
                'px-2.5 py-1.5 text-xs font-medium rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer',
                selectedFilter === type
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              ]"
            >
              <FacebookReactionIcon :type="type" size="xs" />
              <span class="text-[11px] font-bold">{{ getReactionCount(type) }}</span>
            </button>
          </div>

          <!-- Desktop User List -->
          <div class="h-[300px] overflow-y-auto p-3 space-y-1">
            <div v-if="filteredList.length === 0" class="text-center py-12 text-slate-400 text-sm">
              No hay reacciones en esta categoría aún.
            </div>

            <div
              v-for="item in filteredList"
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
                  <p class="text-[11px] text-slate-500 font-medium truncate">
                    {{ item.subtitle || 'Amigo en común' }}
                  </p>
                </div>
              </div>

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
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                ]"
              >
                <Check v-if="connectedUserIds.includes(item.userId)" class="w-3.5 h-3.5 text-emerald-700" />
                <UserPlus v-else class="w-3.5 h-3.5 text-white" />
                <span>{{ connectedUserIds.includes(item.userId) ? 'Amigos' : 'Agregar amigo' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { X, ArrowLeft, Search, UserPlus, Check } from 'lucide-vue-next';
import FacebookReactionIcon from './FacebookReactionIcon.vue';
import SafeImage from '@/shared/components/SafeImage.vue';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import { useFeedStore } from '../store/feedStore';

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

const emit = defineEmits(['close']);
const router = useRouter();
const feedStore = useFeedStore();

const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 640 : true);

function handleResize() {
  isDesktop.value = window.innerWidth >= 640;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

useBodyScrollLock(() => props.isOpen);

const selectedFilter = ref('all');
const showSearch = ref(false);
const searchQuery = ref('');
const connectedUserIds = ref([]);

// Community pool matching realistic Latin American / Venezuela social network contacts
const AUTHENTIC_REACTED_USERS = [
  {
    userId: 'u_wb',
    userName: 'William Bracho',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    type: 'like',
    subtitle: 'Amigo en común · Maracaibo',
  },
  {
    userId: 'u_lp',
    userName: 'Liliana Pirela',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    type: 'love',
    subtitle: 'Amigo en común · Venezuela',
  },
  {
    userId: 'u_mc',
    userName: 'Maria Chiqi Gonzalez',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    type: 'like',
    subtitle: 'Amigo en común · 2 grupos más',
  },
  {
    userId: 'u_gr',
    userName: 'Gonz Rafa',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    type: 'like',
    subtitle: 'Conexión cercana',
  },
  {
    userId: 'u_yv',
    userName: 'Yusi Valero',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    type: 'like',
    subtitle: 'Amigo en común',
  },
  {
    userId: 'u_pg',
    userName: 'Pablo Gutierrez',
    userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    type: 'like',
    subtitle: '1.055 amigos',
  },
  {
    userId: 'u_gv',
    userName: 'Gladys Vasquez',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    type: 'like',
    subtitle: '@gladys.vasquez.37625',
  },
  {
    userId: 'u_ts',
    userName: 'Tania Soto',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    type: 'like',
    subtitle: 'Amigo en común',
  },
  {
    userId: 'u_cg',
    userName: 'Crisola Gil',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    type: 'love',
    subtitle: 'Amigo en común',
  },
  {
    userId: 'u_rh',
    userName: 'Richard Herrera',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    type: 'like',
    subtitle: '119 amigos',
  },
  {
    userId: 'u_rg',
    userName: 'Rosi González',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    type: 'like',
    subtitle: '@rosi.gonzalez.728205',
  },
  {
    userId: 'u_jg',
    userName: 'Juana Garcia',
    userAvatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=300&q=80',
    type: 'care',
    subtitle: 'Amigo en común',
  },
];

const totalReactions = computed(() => {
  const base = Object.values(props.post.reactions || {}).reduce((acc, v) => acc + v, 0);
  return base > 0 ? base : AUTHENTIC_REACTED_USERS.length;
});

const availableReactionTypes = computed(() => {
  const existing = Object.keys(props.post.reactions || {}).filter((k) => props.post.reactions[k] > 0);
  if (existing.length > 0) return existing;
  return ['like', 'love', 'care', 'haha'];
});

function getReactionCount(type) {
  if (props.post.reactions && props.post.reactions[type] !== undefined) {
    return props.post.reactions[type];
  }
  return fullPool.value.filter((u) => u.type === type).length;
}

const fullPool = computed(() => {
  const list = [];

  // 1. Current user if reacted
  if (props.post.userReaction) {
    list.push({
      userId: feedStore.currentUser.id,
      userName: feedStore.currentUser.name,
      userAvatar: feedStore.currentUser.avatar,
      type: props.post.userReaction,
      subtitle: 'Tú',
    });
  }

  // 2. Real reactionsList from post if present
  if (props.post.reactionsList && props.post.reactionsList.length > 0) {
    props.post.reactionsList.forEach((r) => {
      if (!list.some((it) => it.userId === r.userId)) {
        list.push({
          ...r,
          subtitle: r.subtitle || 'Amigo en común',
        });
      }
    });
  }

  // 3. Fallback authentic users
  AUTHENTIC_REACTED_USERS.forEach((au) => {
    if (!list.some((it) => it.userName === au.userName)) {
      list.push(au);
    }
  });

  return list;
});

const filteredList = computed(() => {
  let res = fullPool.value;

  if (selectedFilter.value !== 'all') {
    res = res.filter((it) => it.type === selectedFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    res = res.filter((it) => it.userName.toLowerCase().includes(q));
  }

  return res;
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
