<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 bg-[#f0f2f5] text-slate-900 flex flex-col h-[100dvh] w-full overflow-hidden select-none animate-in slide-in-from-right duration-200"
    >
      <!-- Top App Bar: Back arrow with "Menú" title, Search button on right (Like Image 1) -->
      <div class="px-4 py-3 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <button
          type="button"
          @click="$emit('close')"
          class="flex items-center gap-2 text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer -ml-1 py-1 px-2 rounded-xl active:bg-slate-100"
        >
          <ChevronLeft class="w-6 h-6 stroke-[2.5]" />
          <h2 class="text-xl font-bold tracking-tight text-slate-900 font-display">
            Menú
          </h2>
        </button>

        <button
          type="button"
          @click="isSearchOpen = !isSearchOpen"
          class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Buscar en Socialgea"
        >
          <Search class="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      <!-- Quick Search Bar (Toggleable inside menu) -->
      <div v-if="isSearchOpen" class="px-4 py-2 bg-white border-b border-slate-200/80 animate-in fade-in duration-150">
        <div class="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
          <Search class="w-4 h-4 text-slate-400 shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar en el menú..."
            class="w-full bg-transparent text-xs text-slate-800 outline-none"
            autofocus
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-slate-400 p-0.5">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Scrollable Menu Content (Matching Image 1) -->
      <div class="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
        <!-- 1. Profile Card with Chevron (Direct to Profile) -->
        <RouterLink
          :to="`/profiles/${currentUser.id}`"
          @click="$emit('close')"
          class="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-colors group cursor-pointer"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-11 h-11 rounded-full p-0.5 bg-emerald-500/80 shrink-0">
              <SafeImage
                :src="currentUser.avatar"
                :alt="currentUser.name"
                imgClass="w-full h-full rounded-full object-cover"
                containerClass="w-full h-full"
              />
            </div>
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                {{ currentUser.name }}
              </h3>
              <span class="text-xs text-slate-500 block truncate">
                Ver tu perfil
              </span>
            </div>
          </div>

          <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-slate-200 transition-colors">
            <ChevronDown class="w-4 h-4 stroke-[2.2]" />
          </div>
        </RouterLink>

        <!-- 2. Shortcut Cards Grid (2 Columns, matching Facebook Menu layout from Image 1) -->
        <div class="grid grid-cols-2 gap-2.5">
          <!-- Mensajes -->
          <button
            type="button"
            @click="handleNavigate('/messenger')"
            class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all flex flex-col justify-between h-22 text-left cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center shadow-xs">
              <MessageCircle class="w-4.5 h-4.5" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                Mensajes
              </span>
              <span class="text-[10px] text-slate-400 block truncate">Chats y contactos</span>
            </div>
          </button>

          <!-- Grupos / Comunidades -->
          <button
            type="button"
            @click="handleNavigate('/feeds')"
            class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all flex flex-col justify-between h-22 text-left cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
              <Users2 class="w-4.5 h-4.5" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                Grupos
              </span>
              <span class="text-[10px] text-slate-400 block truncate">Comunidades activas</span>
            </div>
          </button>

          <!-- Amigos -->
          <button
            type="button"
            @click="handleNavigate('/radar')"
            class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all flex flex-col justify-between h-22 text-left cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs">
              <Users class="w-4.5 h-4.5" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                Amigos
              </span>
              <span class="text-[10px] text-slate-400 block truncate">Red y solicitudes</span>
            </div>
          </button>

          <!-- Historias / Reels -->
          <button
            type="button"
            @click="handleNavigate('/historys')"
            class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all flex flex-col justify-between h-22 text-left cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles class="w-4.5 h-4.5" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                Historias
              </span>
              <span class="text-[10px] text-slate-400 block truncate">Momentos 24 horas</span>
            </div>
          </button>

          <!-- Marketplace / Premios -->
          <button
            type="button"
            @click="handleNavigate('/marketplace')"
            class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all flex flex-col justify-between h-22 text-left cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Store class="w-4.5 h-4.5" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                Marketplace
              </span>
              <span class="text-[10px] text-amber-700 font-semibold block truncate">Premios & Canjes</span>
            </div>
          </button>

          <!-- Empresas de Reciclaje -->
          <button
            type="button"
            @click="handleNavigate('/empresas')"
            class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all flex flex-col justify-between h-22 text-left cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
              <Building2 class="w-4.5 h-4.5" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                Empresas
              </span>
              <span class="text-[10px] text-slate-400 block truncate">Centros de acopio</span>
            </div>
          </button>

          <!-- Guardados -->
          <button
            type="button"
            @click="goToSaved"
            class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all flex flex-col justify-between h-22 text-left cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bookmark class="w-4.5 h-4.5" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                Guardado
              </span>
              <span class="text-[10px] text-slate-400 block truncate">Publicaciones favoritas</span>
            </div>
          </button>

          <!-- Recuerdos / Historial -->
          <button
            type="button"
            @click="handleNavigate('/feeds')"
            class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all flex flex-col justify-between h-22 text-left cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-sky-600 text-white flex items-center justify-center shadow-xs">
              <History class="w-4.5 h-4.5" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                Recuerdos
              </span>
              <span class="text-[10px] text-slate-400 block truncate">Un día como hoy</span>
            </div>
          </button>

          <!-- Cumpleaños / Retos Eco -->
          <button
            type="button"
            @click="handleNavigate('/marketplace')"
            class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all flex flex-col justify-between h-22 text-left cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <Gift class="w-4.5 h-4.5" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                EcoPuntos & Retos
              </span>
              <span class="text-[10px] text-slate-400 block truncate">Tus recompensas</span>
            </div>
          </button>

          <!-- Feeds principal -->
          <button
            type="button"
            @click="handleNavigate('/feeds')"
            class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all flex flex-col justify-between h-22 text-left cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <LayoutDashboard class="w-4.5 h-4.5" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                Feeds
              </span>
              <span class="text-[10px] text-slate-400 block truncate">Publicaciones globales</span>
            </div>
          </button>
        </div>

        <!-- 3. Bottom Section: Configuración y Privacidad Accordion (Like Image 1) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100 shadow-2xs">
          <button
            type="button"
            @click="showSettings = !showSettings"
            class="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                <Settings class="w-4.5 h-4.5" />
              </div>
              <span class="text-xs font-bold text-slate-800">
                Configuración y privacidad
              </span>
            </div>
            <ChevronDown
              :class="['w-4 h-4 text-slate-400 transition-transform duration-200', showSettings ? 'rotate-180' : '']"
            />
          </button>

          <div v-if="showSettings" class="p-3 bg-slate-50/70 text-xs text-slate-600 space-y-2 animate-in fade-in duration-100">
            <div class="flex items-center justify-between py-1 px-2 hover:bg-white rounded-lg cursor-pointer">
              <span>Privacidad de la cuenta</span>
              <span class="text-[10px] text-emerald-600 font-bold">Activo</span>
            </div>
            <div class="flex items-center justify-between py-1 px-2 hover:bg-white rounded-lg cursor-pointer">
              <span>Idioma y Región</span>
              <span class="text-[10px] text-slate-400">Colombia (ES)</span>
            </div>
          </div>

          <button
            type="button"
            @click="handleNavigate('/notifications')"
            class="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                <HelpCircle class="w-4.5 h-4.5" />
              </div>
              <span class="text-xs font-bold text-slate-800">
                Ayuda y soporte
              </span>
            </div>
            <ChevronRight class="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            @click="handleLogout"
            class="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer text-red-600"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <LogOut class="w-4.5 h-4.5" />
              </div>
              <span class="text-xs font-bold">
                Cerrar sesión
              </span>
            </div>
          </button>
        </div>

        <!-- Socialgea Version info -->
        <div class="text-center pt-2 pb-6 text-[10.5px] text-slate-400 space-y-0.5">
          <p class="font-bold text-slate-500">Socialgea · Android Web</p>
          <p>Economía Circular & Red Social</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ChevronLeft,
  Search,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Users,
  Users2,
  Sparkles,
  Store,
  Building2,
  Bookmark,
  History,
  Gift,
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  X
} from 'lucide-vue-next';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import { useFeedStore } from '@/context/social/pages/feed/store/feedStore';
import { useAuthStore } from '@/context/social/auth/stores/useAuth.store';
import SafeImage from './SafeImage.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);
const router = useRouter();
const feedStore = useFeedStore();
const authStore = useAuthStore();
const currentUser = feedStore.currentUser;

useBodyScrollLock(() => props.isOpen);

const isSearchOpen = ref(false);
const searchQuery = ref('');
const showSettings = ref(false);

function handleNavigate(path) {
  emit('close');
  router.push(path);
}

function handleLogout() {
  emit('close');
  authStore.logout();
  router.push('/auth/login');
}

function goToSaved() {
  emit('close');
  feedStore.setFilter('saved');
  router.push('/feeds');
}
</script>

