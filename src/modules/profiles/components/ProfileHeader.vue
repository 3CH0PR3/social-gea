<template>
  <div class="bg-white rounded-3xl overflow-hidden shadow-xs border border-slate-200/90">
    <!-- Cover -->
    <div class="relative h-48 sm:h-64 md:h-72 w-full bg-slate-900 overflow-hidden">
      <SafeImage
        :src="user.coverImage"
        alt="Portada de perfil"
        imgClass="w-full h-full object-cover"
        fallbackText="Portada"
      />
      <button
        v-if="isOwnProfile"
        type="button"
        @click="changeCover"
        class="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-sm transition-colors"
      >
        <Camera class="w-4 h-4" />
        <span>Editar portada</span>
      </button>
    </div>

    <!-- Body -->
    <div class="px-6 pb-6 pt-0 relative">
      <div class="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
        <div class="relative group">
          <div
            @click="handleAvatarClick"
            :class="[
              'w-32 h-32 rounded-3xl overflow-hidden shadow-xl transition-all duration-200 select-none',
              hasActiveStory
                ? 'p-1.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 ring-4 ring-emerald-500 ring-offset-2 ring-offset-white cursor-pointer hover:scale-105 active:scale-95'
                : 'p-1 bg-white ring-4 ring-slate-100'
            ]"
            :title="hasActiveStory ? 'Toca para ver la historia' : user.name"
          >
            <div class="w-full h-full rounded-2xl overflow-hidden bg-white">
              <SafeImage
                :src="user.avatar"
                :alt="user.name"
                imgClass="w-full h-full rounded-2xl object-cover"
                containerClass="w-full h-full rounded-2xl"
              />
            </div>
          </div>

          <!-- Story badge indicator -->
          <span
            v-if="hasActiveStory"
            class="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider pointer-events-none ring-2 ring-white"
          >
            Historia
          </span>

          <button
            v-if="isOwnProfile"
            type="button"
            @click.stop="changeAvatar"
            class="absolute bottom-2 right-2 p-2 rounded-xl bg-slate-900/80 text-white hover:bg-slate-900 shadow-md backdrop-blur-sm transition-colors cursor-pointer"
            title="Cambiar foto de perfil"
          >
            <Camera class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-center gap-2.5">
          <template v-if="!isOwnProfile">
            <button
              type="button"
              @click="$emit('open-chat', user)"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <MessageCircle class="w-4 h-4" />
              <span>Enviar Mensaje</span>
            </button>
            <button
              type="button"
              @click="confirmFriendship"
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Users class="w-4 h-4" />
              <span>Amigos</span>
            </button>
          </template>

          <template v-else>
            <button
              type="button"
              @click="isEditingBio = true"
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Edit3 class="w-4 h-4" />
              <span>Editar Biografía</span>
            </button>
          </template>
        </div>
      </div>

      <!-- Names & Bio -->
      <div class="space-y-2 text-center sm:text-left">
        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            {{ user.name }}
          </h1>
          <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block self-center sm:self-auto">
            @{{ user.username }}
          </span>
        </div>

        <div v-if="isEditingBio" class="space-y-2 pt-2">
          <textarea
            v-model="bioDraft"
            class="w-full text-xs p-3 border border-emerald-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            rows="3"
          />
          <div class="flex gap-2 justify-end">
            <button
              type="button"
              @click="isEditingBio = false"
              class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="saveBio"
              class="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Guardar Bio
            </button>
          </div>
        </div>

        <p v-else class="text-sm text-slate-700 max-w-2xl leading-relaxed">
          {{ user.bio }}
        </p>

        <!-- Stats -->
        <div class="flex items-center justify-center sm:justify-start gap-6 pt-3 text-xs text-slate-500 border-t border-slate-100 mt-4">
          <div>
            <span class="font-bold text-slate-900 text-sm mr-1">{{ user.friendsCount || 428 }}</span>
            <span>Amigos</span>
          </div>
          <div>
            <span class="font-bold text-slate-900 text-sm mr-1">{{ postsCount }}</span>
            <span>Publicaciones</span>
          </div>
          <div>
            <span class="font-bold text-slate-900 text-sm mr-1">{{ photosCount }}</span>
            <span>Fotos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex items-center gap-2 border-t border-slate-100 px-6 pt-1 bg-slate-50/50 overflow-x-auto no-scrollbar">
      <button
        type="button"
        @click="$emit('select-tab', 'posts')"
        :class="[
          'flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap',
          activeTab === 'posts'
            ? 'border-emerald-600 text-emerald-700'
            : 'border-transparent text-slate-500 hover:text-slate-700'
        ]"
      >
        <Grid class="w-4 h-4" />
        <span>Publicaciones ({{ postsCount }})</span>
      </button>
      <button
        type="button"
        @click="$emit('select-tab', 'photos')"
        :class="[
          'flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap',
          activeTab === 'photos'
            ? 'border-emerald-600 text-emerald-700'
            : 'border-transparent text-slate-500 hover:text-slate-700'
        ]"
      >
        <ImageIcon class="w-4 h-4" />
        <span>Fotos ({{ photosCount }})</span>
      </button>
      <button
        type="button"
        @click="$emit('select-tab', 'about')"
        :class="[
          'flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap',
          activeTab === 'about'
            ? 'border-emerald-600 text-emerald-700'
            : 'border-transparent text-slate-500 hover:text-slate-700'
        ]"
      >
        <Info class="w-4 h-4" />
        <span>Información</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import {
  Camera,
  Edit3,
  Users,
  MessageCircle,
  Grid,
  Image as ImageIcon,
  Info
} from 'lucide-vue-next';
import { useProfileStore } from '../store/profileStore';
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

const emit = defineEmits(['select-tab', 'open-chat']);
const profileStore = useProfileStore();
const historyStore = useHistoryStore();

const isOwnProfile = computed(() => props.user.id === profileStore.currentUser.id);
const hasActiveStory = computed(() => historyStore.hasStoryForUser(props.user.id));
const isEditingBio = ref(false);
const bioDraft = ref(props.user.bio || '');

function handleAvatarClick() {
  if (hasActiveStory.value) {
    historyStore.openStoryForUser(props.user.id);
  } else if (isOwnProfile.value) {
    changeAvatar();
  }
}

watch(() => props.user.bio, (newBio) => {
  bioDraft.value = newBio || '';
});

function saveBio() {
  profileStore.updateBio(bioDraft.value);
  isEditingBio.value = false;
}

function confirmFriendship() {
  alert(`¡Ya eres amigo de ${props.user.name} en Conecta Radar!`);
}

function changeCover() {
  const url = prompt('Ingresa la URL de la nueva foto de portada:');
  if (url) props.user.coverImage = url;
}

function changeAvatar() {
  const url = prompt('Ingresa la URL de tu nuevo avatar:');
  if (url) props.user.avatar = url;
}
</script>
