<template>
  <div class="w-full pb-6 sm:pb-12 animate-in fade-in duration-200">
    <!-- ========================================================
         1. ANDROID / MOBILE PROFILE VIEW (MATCHING IMAGES 1 & 2)
         - Top App Bar with < Back, Name, Pencil, Search (Magnifying Glass) and More Options
         - Cover with Camera Icon only (no text)
         - Avatar with Camera Icon only (no text)
         - Quick Stats (468 amigos · 83 publicaciones)
         - Action buttons: Agregar a historia & Editar perfil
         - Datos personales card (Location, Hometown)
         - Empleo card (Desarrollo de Software, FullStack)
         - Amigos section with circular avatars & "Ver todo" -> opens MobileFriendsModal
         - Publicaciones section with mini-composer and user posts
         ======================================================== -->
    <div class="sm:hidden bg-white min-h-screen">
      <!-- Mobile Top App Bar (Back arrow, Name, Pencil, Search, More) -->
      <div class="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
        <div class="flex items-center gap-2 min-w-0">
          <button
            type="button"
            @click="handleBack"
            class="p-1.5 -ml-1 text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <ArrowLeft class="w-5 h-5 stroke-[2.4]" />
          </button>
          <h2 class="text-base font-bold text-slate-900 truncate">
            {{ activeProfile.name }}
          </h2>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button
            type="button"
            @click="isEditingProfile = true"
            class="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Editar"
          >
            <Edit3 class="w-4.5 h-4.5" />
          </button>

          <!-- Search Button (Opens the exact same MobileSearchModal component as navbar!) -->
          <button
            type="button"
            @click="isSearchModalOpen = true"
            class="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Buscar personas"
          >
            <Search class="w-4.5 h-4.5 stroke-[2.2]" />
          </button>

          <button
            type="button"
            @click="showMoreOptions = !showMoreOptions"
            class="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Más opciones"
          >
            <MoreHorizontal class="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <!-- Cover Image with Camera icon ONLY (No text) -->
      <div class="relative h-48 w-full bg-slate-900 overflow-hidden">
        <SafeImage
          :src="activeProfile.coverImage"
          alt="Portada"
          imgClass="w-full h-full object-cover"
          containerClass="w-full h-full"
        />
        <!-- Round camera icon button in bottom right -->
        <button
          v-if="isOwnProfile"
          type="button"
          @click="changeCover"
          class="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-transform active:scale-95 absolute bottom-3 right-3 cursor-pointer"
          title="Cambiar foto de portada"
          aria-label="Cambiar foto de portada"
        >
          <Camera class="w-4.5 h-4.5" />
        </button>
      </div>

      <!-- Avatar with Camera icon ONLY + Profile Header info -->
      <div class="px-4 pb-4">
        <div class="flex items-end justify-between -mt-16 mb-2">
          <div class="relative">
            <div class="w-32 h-32 rounded-full p-1 bg-white shadow-xl ring-2 ring-slate-100 overflow-hidden">
              <SafeImage
                :src="activeProfile.avatar"
                :alt="activeProfile.name"
                imgClass="w-full h-full rounded-full object-cover"
                containerClass="w-full h-full"
              />
            </div>
            <!-- Round camera icon button on bottom right of avatar -->
            <button
              v-if="isOwnProfile"
              type="button"
              @click="changeAvatar"
              class="w-9 h-9 rounded-full bg-slate-900/85 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-transform active:scale-95 absolute bottom-1 right-1 cursor-pointer ring-2 ring-white"
              title="Cambiar foto de perfil"
              aria-label="Cambiar foto de perfil"
            >
              <Camera class="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <!-- Name & Bio stats -->
        <div class="space-y-1">
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            {{ activeProfile.name }}
          </h1>

          <div class="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <span>{{ activeProfile.friendsCount || 468 }} amigos</span>
            <span>·</span>
            <span>{{ userPosts.length || 83 }} publicaciones</span>
          </div>

          <div class="flex items-center gap-2 text-xs text-slate-600 pt-0.5">
            <span class="flex items-center gap-1 truncate">
              <MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{{ activeProfile.location || 'Bogotá, Colombia' }}</span>
            </span>
            <span>·</span>
            <span class="flex items-center gap-1 truncate">
              <Briefcase class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{{ activeProfile.work || 'Desarrollo de Software' }}</span>
            </span>
          </div>
        </div>

        <!-- Action buttons row: Agregar a historia & Editar perfil -->
        <div class="pt-3.5 flex items-center gap-2">
          <button
            type="button"
            @click="triggerCreateStory"
            class="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
          >
            <PlusCircle class="w-4 h-4 stroke-[2.2]" />
            <span>Agregar a historia</span>
          </button>

          <button
            type="button"
            @click="isEditingProfile = true"
            class="flex-1 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-98 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
          >
            <Edit3 class="w-4 h-4 text-slate-600" />
            <span>Editar perfil</span>
          </button>
        </div>

        <!-- Profile Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-200 mt-4 text-xs font-bold">
          <button
            type="button"
            @click="activeTab = 'posts'"
            :class="[
              'pb-2.5 px-3 transition-colors cursor-pointer relative',
              activeTab === 'posts' ? 'text-emerald-700' : 'text-slate-500'
            ]"
          >
            <span>Todo</span>
            <span v-if="activeTab === 'posts'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
          </button>

          <button
            type="button"
            @click="activeTab = 'photos'"
            :class="[
              'pb-2.5 px-3 transition-colors cursor-pointer relative',
              activeTab === 'photos' ? 'text-emerald-700' : 'text-slate-500'
            ]"
          >
            <span>Fotos</span>
            <span v-if="activeTab === 'photos'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
          </button>

          <button
            type="button"
            @click="activeTab = 'about'"
            :class="[
              'pb-2.5 px-3 transition-colors cursor-pointer relative',
              activeTab === 'about' ? 'text-emerald-700' : 'text-slate-500'
            ]"
          >
            <span>Información</span>
            <span v-if="activeTab === 'about'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
          </button>
        </div>

        <!-- SECTION 1: DATOS PERSONALES CARD (Matching Image 2) -->
        <div class="pt-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-slate-900 font-display">
              Datos personales
            </h3>
            <button
              type="button"
              @click="isEditingProfile = true"
              class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <Edit3 class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-2.5 text-xs text-slate-700">
            <div class="flex items-center gap-3">
              <MapPin class="w-4.5 h-4.5 text-slate-500 shrink-0" />
              <span>Vive en <strong class="text-slate-900">{{ activeProfile.location || 'Huston, Pennsylvania' }}</strong></span>
            </div>

            <div class="flex items-center gap-3">
              <Home class="w-4.5 h-4.5 text-slate-500 shrink-0" />
              <span>De <strong class="text-slate-900">{{ activeProfile.hometown || 'Sanfrancisco, Zulia, Venezuela' }}</strong></span>
            </div>
          </div>
        </div>

        <!-- SECTION 2: EMPLEO CARD (Matching Image 1) -->
        <div class="pt-4 border-t border-slate-100 mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-slate-900 font-display">
              Empleo
            </h3>
            <button
              type="button"
              @click="isEditingProfile = true"
              class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <Edit3 class="w-4 h-4" />
            </button>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-900 shrink-0 mt-0.5">
              <SafeImage
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80"
                alt="Empresa"
                imgClass="w-full h-full object-cover"
                containerClass="w-full h-full"
              />
            </div>
            <div class="space-y-0.5">
              <h4 class="text-xs font-bold text-slate-900 leading-snug">
                Desarrollo de Software & Soluciones
              </h4>
              <p class="text-[11.5px] text-slate-500">FullStack</p>
              <p class="text-[11px] text-slate-400">
                Desde el 25 jul. 2020 hasta la fecha · 6 años, 2 meses
              </p>
            </div>
          </div>

          <button
            type="button"
            class="text-xs text-slate-500 hover:text-emerald-700 font-semibold block pt-1 cursor-pointer"
          >
            Ver más sobre empleo
          </button>
        </div>

        <!-- SECTION 3: AMIGOS (CIRCULARES PEQUEÑOS + VER TODO) (Matching Image 1) -->
        <div class="pt-4 border-t border-slate-100 mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-slate-900 font-display">
              Amigos
            </h3>
            <button
              type="button"
              @click="isFriendsModalOpen = true"
              class="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Ver todo
            </button>
          </div>

          <!-- 4 Friends in horizontal row matching Image 1: photo_2026-10-03_04-41-42.jpg -->
          <div class="grid grid-cols-4 gap-2 text-center">
            <div
              v-for="friend in previewFriends"
              :key="friend.id"
              class="flex flex-col items-center space-y-1 cursor-pointer group"
              @click="goToFriendProfile(friend.id)"
            >
              <div class="w-14 h-14 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200 shrink-0 group-hover:ring-emerald-500 transition-all">
                <SafeImage
                  :src="friend.avatar"
                  :alt="friend.name"
                  imgClass="w-full h-full object-cover"
                  containerClass="w-full h-full"
                />
              </div>
              <span class="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight">
                {{ friend.name }}
              </span>
              <span class="text-[9.5px] text-slate-400 leading-tight line-clamp-1">
                {{ friend.mutualInfo }}
              </span>
            </div>
          </div>
        </div>

        <!-- SECTION 4: PUBLICACIONES SECTION (Mini Composer & Post Feed) -->
        <div class="pt-5 border-t border-slate-200 mt-4 space-y-3">
          <h3 class="text-sm font-extrabold text-slate-900 font-display">
            Publicaciones
          </h3>

          <!-- Mini Composer Card (Image 1 bottom) -->
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div class="flex items-center gap-2.5">
              <SafeImage
                :src="activeProfile.avatar"
                :alt="activeProfile.name"
                imgClass="w-9 h-9 rounded-full object-cover"
                containerClass="w-9 h-9 rounded-full shrink-0"
              />
              <button
                type="button"
                @click="openComposer"
                class="flex-1 bg-white hover:bg-slate-100 text-slate-500 text-left text-xs px-3.5 py-2 rounded-full border border-slate-200 transition-colors cursor-pointer"
              >
                ¿Qué estás pensando?
              </button>
            </div>

            <div class="flex items-center justify-around border-t border-slate-200/80 pt-2 text-[11px] font-semibold text-slate-600">
              <button type="button" @click="openComposer" class="flex items-center gap-1.5 hover:text-emerald-700 cursor-pointer">
                <ImageIcon class="w-4 h-4 text-emerald-600" />
                <span>Foto</span>
              </button>
              <button type="button" @click="openComposer" class="flex items-center gap-1.5 hover:text-red-700 cursor-pointer">
                <MapPin class="w-4 h-4 text-rose-500" />
                <span>Estoy aquí</span>
              </button>
              <button type="button" @click="openComposer" class="flex items-center gap-1.5 hover:text-purple-700 cursor-pointer">
                <Flag class="w-4 h-4 text-indigo-500" />
                <span>Acontecimiento</span>
              </button>
            </div>
          </div>

          <!-- User's Posts list -->
          <div class="space-y-4 pt-1">
            <div v-if="userPosts.length === 0" class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400">
              No hay publicaciones disponibles en este perfil aún.
            </div>
            <PostCard
              v-for="post in userPosts"
              :key="post.id"
              :post="post"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================
         2. DESKTOP PROFILE VIEW (PRESERVED FOR sm:)
         ======================================================== -->
    <div class="hidden sm:block max-w-4xl mx-auto space-y-6">
      <ProfileHeader
        :user="activeProfile"
        :activeTab="activeTab"
        :postsCount="userPosts.length"
        :photosCount="userPhotos.length"
        @select-tab="activeTab = $event"
        @open-chat="openChat"
      />

      <!-- Posts Tab -->
      <div v-if="activeTab === 'posts'" class="space-y-4">
        <div v-if="userPosts.length === 0" class="bg-white rounded-3xl p-10 text-center text-slate-400 border border-slate-200">
          No hay publicaciones en este perfil aún.
        </div>
        <PostCard
          v-for="post in userPosts"
          :key="post.id"
          :post="post"
        />
      </div>

      <!-- Photos Tab -->
      <ProfilePhotos
        v-else-if="activeTab === 'photos'"
        :photos="userPhotos"
      />

      <!-- Info Tab -->
      <ProfileInfo
        v-else-if="activeTab === 'about'"
        :user="activeProfile"
      />
    </div>

    <!-- ========================================================
         3. UNIFIED ANDROID SEARCH MODAL (Image 3)
         - Opened directly by the search magnifying glass on profile!
         ======================================================== -->
    <MobileSearchModal
      :isOpen="isSearchModalOpen"
      @close="isSearchModalOpen = false"
    />

    <!-- ========================================================
         4. ANDROID ALL FRIENDS FULL-SCREEN MODAL
         - Opened by "Ver todo" in the Amigos section!
         ======================================================== -->
    <MobileFriendsModal
      :isOpen="isFriendsModalOpen"
      :friends="allFriends"
      @close="isFriendsModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowLeft,
  Search,
  Edit3,
  MoreHorizontal,
  Camera,
  MapPin,
  Briefcase,
  Home,
  PlusCircle,
  Image as ImageIcon,
  Flag
} from 'lucide-vue-next';
import { useProfile } from '../composables/useProfile';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import { useMessengerStore } from '@/modules/messenger/store/messengerStore';
import ProfileHeader from '../components/ProfileHeader.vue';
import ProfilePhotos from '../components/ProfilePhotos.vue';
import ProfileInfo from '../components/ProfileInfo.vue';
import PostCard from '@/modules/feeds/components/PostCard.vue';
import MobileSearchModal from '@/shared/components/MobileSearchModal.vue';
import MobileFriendsModal from '../components/MobileFriendsModal.vue';
import SafeImage from '@/shared/components/SafeImage.vue';

const route = useRoute();
const router = useRouter();
const { activeProfile, activeTab, loadProfile } = useProfile();
const feedStore = useFeedStore();
const messengerStore = useMessengerStore();

const isSearchModalOpen = ref(false);
const isFriendsModalOpen = ref(false);
const isEditingProfile = ref(false);
const showMoreOptions = ref(false);

onMounted(() => {
  feedStore.loadPosts();
  loadProfile(route.params.id);
});

watch(
  () => route.params.id,
  (newId) => {
    loadProfile(newId);
  }
);

const isOwnProfile = computed(() => {
  return !route.params.id || route.params.id === feedStore.currentUser.id;
});

const userPosts = computed(() => {
  return feedStore.posts.filter((p) => p.authorId === activeProfile.value?.id);
});

const userPhotos = computed(() => {
  return userPosts.value.flatMap((p) => p.images || []);
});

// Friends list matching Image 1: photo_2026-10-03_04-41-42.jpg
const previewFriends = ref([
  {
    id: 'fr_1',
    name: 'Jeferson Jose Bello H.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '64 en común',
  },
  {
    id: 'fr_2',
    name: 'A Krishna Murtix',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '39 en común',
  },
  {
    id: 'fr_3',
    name: 'Daniela Castellanos',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '1 nuevo',
  },
  {
    id: 'fr_4',
    name: 'Méndez Enderson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    mutualInfo: '2 nuevos',
  }
]);

const allFriends = ref([
  ...previewFriends.value,
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
]);

function handleBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/feeds');
  }
}

function goToFriendProfile(friendId) {
  router.push(`/profiles/${friendId}`);
}

function openChat(user) {
  messengerStore.openWithUser(user);
}

function openComposer() {
  // Can trigger composer modal
}

function triggerCreateStory() {
  router.push('/historys');
}

function changeCover() {
  // Triggers photo change
}

function changeAvatar() {
  // Triggers photo change
}
</script>
