<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
      <!-- Zone 1: Logo & Search (Logo only without text, search bar smaller and beside logo) -->
      <div class="flex items-center gap-2 shrink-0">
        <RouterLink to="/feeds" class="flex items-center focus:outline-none" aria-label="Ir a Inicio">
          <RadarLogo :size="38" :showText="false" withRadarPulse />
        </RouterLink>

        <!-- Compact Search Bar attached closely to the logo -->
        <div class="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/70 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 rounded-full px-2.5 py-1.5 transition-all w-36 sm:w-44 md:w-48 border border-transparent focus-within:border-emerald-400">
          <Search class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            :value="feedStore.searchQuery"
            @input="feedStore.setSearch($event.target.value)"
            placeholder="Buscar..."
            class="w-full bg-transparent text-xs text-slate-800 outline-none placeholder-slate-400"
          />
        </div>
      </div>

      <!-- Zone 2: Navigation Links -->
      <nav class="hidden sm:flex items-center gap-1 md:gap-2 h-full">
        <RouterLink
          to="/feeds"
          class="relative flex items-center justify-center px-4 md:px-6 h-full transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-xl my-1"
          active-class="text-emerald-600 font-bold !bg-transparent"
          title="Inicio"
        >
          <Home class="w-5 h-5" />
          <span
            v-if="$route.path === '/' || $route.path === '/feeds'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/radar"
          class="relative flex items-center justify-center px-4 md:px-6 h-full transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-xl my-1"
          active-class="text-emerald-600 font-bold !bg-transparent"
          title="Radar de Amigos"
        >
          <Radar class="w-5 h-5" />
          <span class="absolute top-3 right-3 md:right-5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span
            v-if="$route.path === '/radar'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/historys"
          class="relative flex items-center justify-center px-4 md:px-6 h-full transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-xl my-1"
          active-class="text-emerald-600 font-bold !bg-transparent"
          title="Historias"
        >
          <Sparkles class="w-5 h-5" />
          <span
            v-if="$route.path === '/historys'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/empresas"
          class="relative flex items-center justify-center px-4 md:px-6 h-full transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-xl my-1"
          active-class="text-emerald-600 font-bold !bg-transparent"
          title="Empresas de Reciclaje"
        >
          <Building2 class="w-5 h-5" />
          <span
            v-if="$route.path.startsWith('/empresas')"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>

        <RouterLink
          to="/marketplace"
          class="relative flex items-center justify-center px-4 md:px-6 h-full transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-xl my-1"
          active-class="text-emerald-600 font-bold !bg-transparent"
          title="Marketplace"
        >
          <Store class="w-5 h-5" />
          <span
            v-if="$route.path.startsWith('/marketplace')"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
          />
        </RouterLink>
      </nav>

      <!-- Zone 3: Actions (Notifications and Messages only) -->
      <div class="flex items-center gap-1.5 sm:gap-2">
        <!-- Notifications button -->
        <RouterLink
          to="/notifications"
          class="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center"
          title="Notificaciones"
        >
          <Bell class="w-4.5 h-4.5" />
          <span
            v-if="unreadNotifs > 0"
            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ unreadNotifs }}
          </span>
        </RouterLink>

        <!-- Messenger trigger button -->
        <button
          type="button"
          @click="messengerStore.toggleDrawer"
          class="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center"
          title="Mensajes de Conecta"
        >
          <MessageCircle class="w-4.5 h-4.5" />
          <span
            v-if="unreadMessages > 0"
            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ unreadMessages }}
          </span>
        </button>

        <!-- User Profile Dropdown -->
        <div class="relative">
          <button
            type="button"
            @click="showDropdown = !showDropdown"
            class="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
          >
            <div class="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-400">
              <SafeImage
                :src="currentUser.avatar"
                :alt="currentUser.name"
                imgClass="w-full h-full rounded-full object-cover"
              />
            </div>
            <ChevronDown class="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          <div
            v-if="showDropdown"
            class="absolute right-0 top-11 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            @click="showDropdown = false"
          >
            <RouterLink
              :to="`/profiles/${currentUser.id}`"
              class="px-4 py-2 flex items-center gap-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
            >
              <img
                :src="currentUser.avatar"
                :alt="currentUser.name"
                class="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-500"
              />
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-slate-900 truncate">{{ currentUser.name }}</h4>
                <span class="text-[11px] text-emerald-600 font-medium">Ver mi perfil</span>
              </div>
            </RouterLink>

            <div class="py-1">
              <RouterLink
                :to="`/profiles/${currentUser.id}`"
                class="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left"
              >
                <UserIcon class="w-4 h-4 text-slate-400" />
                <span>Tu perfil</span>
              </RouterLink>
              <RouterLink
                to="/feeds"
                @click="feedStore.setFilter('saved')"
                class="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left"
              >
                <Bookmark class="w-4 h-4 text-slate-400" />
                <span>Publicaciones guardadas</span>
              </RouterLink>
              <button
                type="button"
                @click="alert('Configuración y Privacidad')"
                class="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left"
              >
                <Settings class="w-4 h-4 text-slate-400" />
                <span>Configuración</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import {
  Search,
  Home,
  Radar,
  Sparkles,
  Building2,
  Store,
  Bell,
  MessageCircle,
  User as UserIcon,
  Bookmark,
  Settings,
  ChevronDown
} from 'lucide-vue-next';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import { useNotificationStore } from '@/modules/notifications/store/notificationStore';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import RadarLogo from './RadarLogo.vue';
import SafeImage from './SafeImage.vue';

defineEmits(['open-create-post']);

const feedStore = useFeedStore();
const notificationStore = useNotificationStore();
const messengerStore = useMessengerStore();
const route = useRoute();

const showDropdown = ref(false);
const currentUser = feedStore.currentUser;

const unreadNotifs = computed(() => notificationStore.unreadCount);
const unreadMessages = computed(() => messengerStore.unreadCount);
</script>
