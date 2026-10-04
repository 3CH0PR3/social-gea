<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col h-[100dvh] w-full overflow-hidden select-none animate-in slide-in-from-right duration-200"
    >
      <!-- Top App Bar -->
      <div class="px-3.5 py-3 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="p-2 -ml-1 text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <ArrowLeft class="w-5 h-5 stroke-[2.4]" />
          </button>
          <div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight font-display">
              Todos los amigos
            </h3>
            <span class="text-xs text-slate-500 font-medium">
              {{ friendsPool.length }} amigos
            </span>
          </div>
        </div>

        <button
          type="button"
          @click="showSearch = !showSearch"
          :class="[
            'p-2 rounded-full transition-colors cursor-pointer',
            showSearch ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
          ]"
        >
          <Search class="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      <!-- Quick Search Input -->
      <div v-if="showSearch" class="p-2.5 bg-slate-50 border-b border-slate-200 animate-in fade-in duration-100">
        <div class="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-slate-200 shadow-2xs">
          <Search class="w-4 h-4 text-slate-400 shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar entre tus amigos..."
            class="w-full bg-transparent text-xs text-slate-800 outline-none"
            autofocus
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-slate-400 p-0.5">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-slate-50/70 overflow-x-auto no-scrollbar shrink-0">
        <button
          type="button"
          @click="selectedTab = 'all'"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
            selectedTab === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          ]"
        >
          Todos ({{ friendsPool.length }})
        </button>

        <button
          type="button"
          @click="selectedTab = 'recent'"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
            selectedTab === 'recent'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          ]"
        >
          Agregados recientemente
        </button>

        <button
          type="button"
          @click="selectedTab = 'mutual'"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
            selectedTab === 'mutual'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          ]"
        >
          En común
        </button>
      </div>

      <!-- Friends List -->
      <div class="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-0.5">
        <div v-if="filteredFriends.length === 0" class="text-center py-20 text-slate-400 text-xs">
          No se encontraron amigos con ese criterio.
        </div>

        <div
          v-for="friend in filteredFriends"
          :key="friend.id"
          class="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
          @click="navigateToProfile(friend.id)"
        >
          <div class="flex items-center gap-3 min-w-0">
            <SafeImage
              :src="friend.avatar"
              :alt="friend.name"
              imgClass="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200"
              containerClass="w-12 h-12 rounded-full bg-slate-100"
            />
            <div class="min-w-0">
              <h4 class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                {{ friend.name }}
              </h4>
              <p class="text-[11.5px] text-slate-500 truncate mt-0.5">
                {{ friend.mutualInfo || 'Amigo en común' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1.5 shrink-0" @click.stop>
            <button
              type="button"
              @click="openChat(friend)"
              class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Enviar mensaje"
            >
              <MessageCircle class="w-4.5 h-4.5" />
            </button>

            <button
              type="button"
              @click="openOptions(friend)"
              class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Más opciones"
            >
              <MoreHorizontal class="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeft,
  Search,
  X,
  MessageCircle,
  MoreHorizontal
} from 'lucide-vue-next';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import { useMessengerStore } from '@/context/social/pages/messenger/store/messengerStore';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  friends: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close']);
const router = useRouter();
const messengerStore = useMessengerStore();

useBodyScrollLock(() => props.isOpen);

const showSearch = ref(false);
const searchQuery = ref('');
const selectedTab = ref('all');

// Authentic Latin American friend pool matching Image 1 & 2
const defaultFriends = [
  {
    id: 'fr_1',
    name: 'Jeferson Jose Bello Hernández',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '64 amigos en común',
  },
  {
    id: 'fr_2',
    name: 'A Krishna Murtix',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '39 amigos en común',
  },
  {
    id: 'fr_3',
    name: 'Daniela Castellanos',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '1 nuevo amigo',
  },
  {
    id: 'fr_4',
    name: 'Méndez Enderson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '2 nuevos amigos',
  },
  {
    id: 'fr_5',
    name: 'Liliana Pirela',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '45 amigos en común',
  },
  {
    id: 'fr_6',
    name: 'Gonz Rafa',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '18 amigos en común',
  },
  {
    id: 'fr_7',
    name: 'Yusi Valero',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '12 amigos en común',
  },
  {
    id: 'fr_8',
    name: 'Pablo Gutierrez',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '31 amigos en común',
  }
];

const friendsPool = computed(() => {
  return props.friends && props.friends.length > 0 ? props.friends : defaultFriends;
});

const filteredFriends = computed(() => {
  let list = friendsPool.value;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((f) => f.name.toLowerCase().includes(q));
  }

  return list;
});

function navigateToProfile(friendId) {
  emit('close');
  router.push(`/profiles/${friendId}`);
}

function openChat(friend) {
  emit('close');
  messengerStore.openWithUser(friend);
}

function openOptions(friend) {
  // Simple toast or fallback action
}
</script>
