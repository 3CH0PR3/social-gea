<template>
  <div class="bg-white rounded-md overflow-hidden shadow-xs border border-slate-200">
    <!-- Hidden File Inputs for native device upload (Own Profile only) -->
    <input
      v-if="isOwnProfile"
      type="file"
      ref="coverFileInput"
      accept="image/*"
      class="hidden"
      @change="handleCoverFileSelected"
    />
    <input
      v-if="isOwnProfile"
      type="file"
      ref="avatarFileInput"
      accept="image/*"
      class="hidden"
      @change="handleAvatarFileSelected"
    />

    <!-- Cover Image Container -->
    <div class="relative h-44 sm:h-56 md:h-64 lg:h-72 w-full bg-slate-900 overflow-hidden">
      <SafeImage
        :src="user.coverImage"
        alt="Portada de perfil"
        imgClass="w-full h-full object-cover"
        fallbackText="Portada"
      />

      <!-- Change Cover Button: ONLY on Own Profile -->
      <button
        v-if="isOwnProfile"
        type="button"
        @click="triggerCoverUpload"
        class="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer shadow-md active:scale-95 border border-emerald-500/40 ring-1 ring-emerald-400/30 z-20"
        title="Cambiar foto de portada"
        aria-label="Cambiar foto de portada"
      >
        <Camera class="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-300" />
      </button>
    </div>

    <!-- Header Body / User Bio Section -->
    <div class="px-4 sm:px-6 md:px-8 pb-4 pt-2 relative">
      <div class="flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
        <!-- Left: Avatar & User Names/Metadata -->
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-3.5 sm:gap-5 -mt-14 sm:-mt-16 md:-mt-18 min-w-0">
          <!-- Avatar with Smooth Rolling Animated Story Border -->
          <div class="relative group select-none shrink-0">
            <div
              @click="handleAvatarClick"
              class="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              :title="hasActiveStory ? 'Toca para ver la historia' : user.name"
            >
              <!-- Animated rotating story border ring (no text badge) -->
              <div v-if="hasActiveStory" class="sg-story-ring-animated" />

              <!-- White avatar background and image -->
              <div
                :class="[
                  'relative z-10 w-full h-full rounded-full overflow-hidden bg-white shadow-xl',
                  hasActiveStory ? 'p-1.5' : 'p-1 ring-4 ring-white'
                ]"
              >
                <div class="w-full h-full rounded-full overflow-hidden bg-slate-100">
                  <SafeImage
                    :src="user.avatar"
                    :alt="user.name"
                    imgClass="w-full h-full rounded-full object-cover"
                    containerClass="w-full h-full rounded-full"
                  />
                </div>
              </div>
            </div>

            <!-- Avatar Camera Button (Own Profile Only) with soft green ring -->
            <button
              v-if="isOwnProfile"
              type="button"
              @click.stop="triggerAvatarUpload"
              class="absolute bottom-1 right-1 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/90 text-white hover:bg-slate-900 shadow-md backdrop-blur-xs flex items-center justify-center transition-all active:scale-90 cursor-pointer border border-emerald-500/40 ring-1 ring-emerald-400/30"
              title="Cambiar foto de perfil"
              aria-label="Cambiar foto de perfil"
            >
              <Camera class="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-300" />
            </button>
          </div>

          <!-- User Name and Friends Count ONLY -->
          <div class="space-y-0.5 text-center sm:text-left pt-2 sm:pt-3 min-w-0">
            <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-display truncate">
              {{ user.name }}
            </h1>

            <div class="flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-semibold text-slate-500">
              <span>{{ user.friendsCount || 468 }} amigos</span>
              <template v-if="!isOwnProfile && user.mutualCount">
                <span>·</span>
                <span class="text-slate-700 font-bold">{{ user.mutualCount }} en común</span>
              </template>
            </div>
          </div>
        </div>

        <!-- Right: Action Buttons -->
        <div class="flex items-center gap-2.5 shrink-0 pt-1 md:pt-0 w-full sm:w-auto justify-center sm:justify-end">
          <!-- 1. OTHER PERSON'S PROFILE ACTIONS -->
          <template v-if="!isOwnProfile">
            <!-- If already Friends -->
            <template v-if="user.isFriend !== false">
              <!-- Button: Amigos (triggers bottom sheet / options) -->
              <button
                type="button"
                @click="$emit('open-friend-options', user)"
                class="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-slate-200"
              >
                <UserCheck class="w-4 h-4 text-emerald-700" />
                <span>Amigos</span>
              </button>

              <!-- Button: Mensaje (Facebook Blue) -->
              <button
                type="button"
                @click="$emit('open-chat', user)"
                class="px-4 sm:px-5 py-2 rounded-md bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <MessageCircle class="w-4 h-4" />
                <span>Mensaje</span>
              </button>

              <!-- Button: Dar un toque (Poke) -->
              <button
                type="button"
                @click="$emit('send-poke', user)"
                class="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer active:scale-95 border border-slate-200"
                title="Dar un toque a esta persona"
                aria-label="Dar un toque"
              >
                <Zap class="w-4 h-4 text-amber-500 fill-amber-500" />
              </button>
            </template>

            <!-- If Not Friends Yet -->
            <template v-else>
              <!-- Button: Agregar a amigos -->
              <button
                type="button"
                @click="$emit('add-friend', user)"
                class="px-4 sm:px-5 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <UserPlus class="w-4 h-4 stroke-[2.2]" />
                <span>Agregar a amigos</span>
              </button>

              <!-- Button: Mensaje -->
              <button
                type="button"
                @click="$emit('open-chat', user)"
                class="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-slate-200"
              >
                <MessageCircle class="w-4 h-4" />
                <span>Mensaje</span>
              </button>

              <!-- Button: Dar un toque -->
              <button
                type="button"
                @click="$emit('send-poke', user)"
                class="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer active:scale-95 border border-slate-200"
                title="Dar un toque a esta persona"
                aria-label="Dar un toque"
              >
                <Zap class="w-4 h-4 text-amber-500 fill-amber-500" />
              </button>
            </template>
          </template>

          <!-- 2. OWN PROFILE ACTIONS ONLY -->
          <template v-else>
            <!-- Button: Agregar a historia -->
            <button
              type="button"
              @click="$emit('create-story')"
              class="px-3.5 sm:px-4 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus class="w-4 h-4 stroke-[2.5]" />
              <span>Agregar a historia</span>
            </button>

            <!-- Button: Editar perfil -->
            <button
              type="button"
              @click="$emit('edit-profile')"
              class="px-3.5 sm:px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-slate-200"
            >
              <Edit3 class="w-4 h-4 text-slate-600" />
              <span>Editar perfil</span>
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs (Todo | Información | Amigos | Fotos) -->
    <div class="flex items-center gap-2 border-t border-slate-200 px-4 sm:px-8 bg-white overflow-x-auto no-scrollbar">
      <button
        type="button"
        @click="$emit('select-tab', 'posts')"
        :class="[
          'flex items-center gap-1.5 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer',
          activeTab === 'posts'
            ? 'border-emerald-700 text-emerald-800 font-extrabold'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        <span>Todo</span>
      </button>

      <button
        type="button"
        @click="$emit('select-tab', 'about')"
        :class="[
          'flex items-center gap-1.5 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer',
          activeTab === 'about'
            ? 'border-emerald-700 text-emerald-800 font-extrabold'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        <span>Información</span>
      </button>

      <button
        type="button"
        @click="$emit('select-tab', 'friends')"
        :class="[
          'flex items-center gap-1.5 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer',
          activeTab === 'friends'
            ? 'border-emerald-700 text-emerald-800 font-extrabold'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        <span>Amigos</span>
      </button>

      <button
        type="button"
        @click="$emit('select-tab', 'photos')"
        :class="[
          'flex items-center gap-1.5 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer',
          activeTab === 'photos'
            ? 'border-emerald-700 text-emerald-800 font-extrabold'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        <span>Fotos</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Camera,
  Edit3,
  UserCheck,
  UserPlus,
  MessageCircle,
  Plus,
  Zap
} from 'lucide-vue-next';
import { useProfileStore } from '../store/profileStore';
import { useFeedStore } from '@/modules/feeds/store/feedStore';
import { useHistoryStore } from '@/modules/historys/store/historyStore';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  activeTab: {
    type: String,
    default: 'posts',
  },
  postsCount: {
    type: Number,
    default: 0,
  },
  photosCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits([
  'select-tab',
  'open-chat',
  'create-story',
  'edit-profile',
  'open-friend-options',
  'add-friend',
  'send-poke'
]);

const profileStore = useProfileStore();
const feedStore = useFeedStore();
const historyStore = useHistoryStore();

const coverFileInput = ref(null);
const avatarFileInput = ref(null);

const isOwnProfile = computed(() => {
  return props.user.id === profileStore.currentUser.id || props.user.id === 'user_current';
});

const hasActiveStory = computed(() => historyStore.hasStoryForUser(props.user.id));

function handleAvatarClick() {
  if (hasActiveStory.value) {
    historyStore.openStoryForUser(props.user.id);
  } else if (isOwnProfile.value) {
    triggerAvatarUpload();
  }
}

function triggerCoverUpload() {
  coverFileInput.value?.click();
}

function triggerAvatarUpload() {
  avatarFileInput.value?.click();
}

function handleCoverFileSelected(event) {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      props.user.coverImage = dataUrl;
      if (isOwnProfile.value) {
        profileStore.currentUser.coverImage = dataUrl;
        feedStore.currentUser.coverImage = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  }
}

function handleAvatarFileSelected(event) {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      props.user.avatar = dataUrl;
      if (isOwnProfile.value) {
        profileStore.currentUser.avatar = dataUrl;
        feedStore.currentUser.avatar = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  }
}
</script>
