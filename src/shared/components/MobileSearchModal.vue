<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col h-[100dvh] w-full overflow-hidden select-none animate-in slide-in-from-right duration-200"
    >
      <!-- Top Search Bar (Matching Image 3: photo_2026-10-03_04-42-53.jpg) -->
      <div class="px-3.5 py-3 bg-white border-b border-slate-200/90 flex items-center gap-2 shrink-0 sticky top-0 z-20">
        <button
          type="button"
          @click="$emit('close')"
          class="p-2 -ml-1 text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors cursor-pointer"
          aria-label="Volver"
        >
          <ArrowLeft class="w-5 h-5 stroke-[2.4]" />
        </button>

        <div class="flex-1 flex items-center gap-2 bg-slate-100 rounded-full px-3.5 py-2 border border-slate-200/80 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar..."
            class="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            autofocus
            @keydown.enter="handleSearchSubmit"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="p-0.5 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X class="w-4 h-4" />
          </button>
          <Search v-else class="w-4.5 h-4.5 text-slate-400 shrink-0" />
        </div>
      </div>

      <!-- Scrollable Search View Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-6">
        <!-- MODE A: ACTIVE SEARCH RESULTS (When typing) -->
        <div v-if="searchQuery.trim()" class="space-y-4">
          <div class="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
            <span>Resultados para "{{ searchQuery }}"</span>
            <span>{{ searchResults.length }} encontrados</span>
          </div>

          <div v-if="searchResults.length === 0" class="text-center py-16 text-slate-400 text-xs">
            <UserX class="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p>No se encontraron personas con ese nombre.</p>
          </div>

          <div class="divide-y divide-slate-100">
            <div
              v-for="person in searchResults"
              :key="person.id"
              class="flex items-center justify-between py-2.5 px-1 hover:bg-slate-50 transition-colors rounded-xl cursor-pointer"
              @click="goToProfile(person.id)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <SafeImage
                  :src="person.avatar"
                  :alt="person.name"
                  imgClass="w-11 h-11 rounded-full object-cover"
                  containerClass="w-11 h-11 rounded-full bg-slate-100"
                />
                <div class="min-w-0">
                  <h4 class="text-sm font-bold text-slate-900 truncate">{{ person.name }}</h4>
                  <p class="text-xs text-slate-500 truncate">{{ person.location || person.mutualInfo || 'Amigo en común' }}</p>
                </div>
              </div>

              <button
                type="button"
                @click.stop="toggleConnect(person)"
                :class="[
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ml-2',
                  connectedIds.includes(person.id)
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                ]"
              >
                {{ connectedIds.includes(person.id) ? 'Conectado' : 'Conectar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- MODE B: DEFAULT RECENT SEARCHES & SUGGESTIONS (Exact match to Image 3) -->
        <div v-else class="space-y-6">
          <!-- 1. Recientes Section -->
          <div class="space-y-2">
            <div class="flex items-center justify-between px-1">
              <h3 class="text-base font-extrabold text-slate-900 font-display">Recientes</h3>
              <button
                type="button"
                @click="clearRecentSearches"
                class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                Ver todo
              </button>
            </div>

            <!-- List of Recent Profiles & Keywords -->
            <div class="divide-y divide-slate-100">
              <!-- Recent Profiles -->
              <div
                v-for="rec in recentProfiles"
                :key="rec.id"
                class="flex items-center justify-between py-2.5 px-1 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                @click="goToProfile(rec.id)"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="relative shrink-0">
                    <SafeImage
                      :src="rec.avatar"
                      :alt="rec.name"
                      imgClass="w-10 h-10 rounded-full object-cover"
                      containerClass="w-10 h-10 rounded-full"
                    />
                    <span
                      v-if="rec.hasUpdate"
                      class="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white"
                    />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-bold text-slate-800 group-hover:text-emerald-700 truncate">
                      {{ rec.name }}
                    </h4>
                    <span v-if="rec.subtitle" class="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>{{ rec.subtitle }}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  @click.stop="removeRecent(rec.id)"
                  class="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                  title="Opciones"
                >
                  <MoreHorizontal class="w-4 h-4" />
                </button>
              </div>

              <!-- Recent Search Keywords with Clock Icon (Matching letters / letras in Image 3) -->
              <div
                v-for="term in recentTerms"
                :key="term"
                class="flex items-center justify-between py-2.5 px-1 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                @click="searchQuery = term"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Clock class="w-4.5 h-4.5" />
                  </div>
                  <span class="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 truncate">
                    {{ term }}
                  </span>
                </div>

                <button
                  type="button"
                  @click.stop="removeTerm(term)"
                  class="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <MoreHorizontal class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- 2. Personas que quizá conozcas (Matching bottom section of Image 3) -->
          <div class="space-y-3 pt-2 border-t border-slate-100">
            <h3 class="text-sm sm:text-base font-extrabold text-slate-900 font-display px-1">
              Personas que quizá conozcas
            </h3>

            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="sug in suggestedPeople"
                :key="sug.id"
                class="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2 cursor-pointer hover:border-slate-300 transition-colors"
                @click="goToProfile(sug.id)"
              >
                <div class="w-full h-28 rounded-xl overflow-hidden bg-slate-100">
                  <SafeImage
                    :src="sug.avatar"
                    :alt="sug.name"
                    imgClass="w-full h-full object-cover"
                    containerClass="w-full h-full"
                  />
                </div>

                <div>
                  <h4 class="text-xs font-bold text-slate-900 truncate">{{ sug.name }}</h4>
                  <span class="text-[10.5px] text-slate-400 truncate block mt-0.5">
                    {{ sug.mutualFriends || '3 amigos en común' }}
                  </span>
                </div>

                <button
                  type="button"
                  @click.stop="toggleConnect(sug)"
                  :class="[
                    'w-full py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1',
                    connectedIds.includes(sug.id)
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                  ]"
                >
                  <UserPlus v-if="!connectedIds.includes(sug.id)" class="w-3.5 h-3.5" />
                  <span>{{ connectedIds.includes(sug.id) ? 'Conectado' : 'Conectar' }}</span>
                </button>
              </div>
            </div>
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
  Clock,
  MoreHorizontal,
  UserPlus,
  UserX
} from 'lucide-vue-next';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import { useRadarStore } from '@/modules/radar/store/radarStore';
import SafeImage from './SafeImage.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);
const router = useRouter();
const radarStore = useRadarStore();

useBodyScrollLock(() => props.isOpen);

const searchQuery = ref('');
const connectedIds = ref([]);

// Recent profiles matching Image 3 (photo_2026-10-03_04-42-53.jpg)
const recentProfiles = ref([
  {
    id: 'user_tamara',
    name: 'Tamara Inka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    subtitle: '2 nuevos',
    hasUpdate: true,
  },
  {
    id: 'user_eli',
    name: 'Eli Hernandez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    subtitle: '',
    hasUpdate: false,
  },
  {
    id: 'user_willianny',
    name: 'Willianny Ramirez',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    subtitle: '1 nuevo',
    hasUpdate: true,
  },
  {
    id: 'user_martinez',
    name: 'Martínez Meli',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    subtitle: '',
    hasUpdate: false,
  },
  {
    id: 'user_andres',
    name: 'Andres Jh\'ndz',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    subtitle: '',
    hasUpdate: false,
  },
]);

// Recent search keywords matching Image 3
const recentTerms = ref(['letras', 'letters', 'reciclaje bogotá']);

// Suggested people
const suggestedPeople = ref([
  {
    id: 'sug_1',
    name: 'Yurimar Díaz',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    mutualFriends: '12 amigos en común',
  },
  {
    id: 'sug_2',
    name: 'Katherine Morán',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    mutualFriends: '8 amigos en común',
  },
]);

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const q = searchQuery.value.toLowerCase().trim();
  return radarStore.users.filter((u) => u.name.toLowerCase().includes(q));
});

function goToProfile(userId) {
  emit('close');
  router.push(`/profiles/${userId}`);
}

function handleSearchSubmit() {
  if (searchQuery.value.trim() && !recentTerms.value.includes(searchQuery.value.trim())) {
    recentTerms.value.unshift(searchQuery.value.trim());
  }
}

function removeRecent(id) {
  recentProfiles.value = recentProfiles.value.filter((p) => p.id !== id);
}

function removeTerm(term) {
  recentTerms.value = recentTerms.value.filter((t) => t !== term);
}

function clearRecentSearches() {
  recentProfiles.value = [];
  recentTerms.value = [];
}

function toggleConnect(person) {
  if (connectedIds.value.includes(person.id)) {
    connectedIds.value = connectedIds.value.filter((id) => id !== person.id);
  } else {
    connectedIds.value.push(person.id);
  }
}
</script>
