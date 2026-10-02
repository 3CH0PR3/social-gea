<template>
  <article class="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden transition-shadow hover:shadow-sm">
    <!-- 1. Header (Author, Time, Privacy, 3-dots Menu) -->
    <div class="p-4 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <RouterLink :to="`/profiles/${post.authorId}`" class="relative cursor-pointer">
          <SafeImage
            :src="post.authorAvatar"
            :alt="post.authorName"
            imgClass="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/80 hover:opacity-90 transition-opacity"
            containerClass="w-10 h-10 rounded-full"
          />
        </RouterLink>

        <div>
          <div class="flex items-center gap-1.5 flex-wrap">
            <RouterLink
              :to="`/profiles/${post.authorId}`"
              class="text-sm font-bold text-slate-900 hover:underline cursor-pointer"
            >
              {{ post.authorName }}
            </RouterLink>

            <span
              v-if="post.authorVerified"
              title="Verificado"
              class="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]"
            >
              ✓
            </span>

            <span v-if="post.feeling" class="text-xs text-slate-500 flex items-center gap-1">
              está <span>{{ post.feeling.emoji }}</span> {{ post.feeling.text }}
            </span>
          </div>

          <div class="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
            <span>{{ post.timestamp }}</span>
            <span aria-hidden="true">·</span>
            <template v-if="post.location">
              <span class="text-slate-500 truncate max-w-[180px]">{{ post.location }}</span>
              <span aria-hidden="true">·</span>
            </template>
            <span v-if="post.privacy === 'public'" title="Público" class="flex items-center">
              <Globe class="w-3.5 h-3.5 text-slate-400" />
            </span>
            <span v-else-if="post.privacy === 'friends'" title="Amigos" class="flex items-center">
              <Users class="w-3.5 h-3.5 text-slate-400" />
            </span>
            <span v-else title="Solo yo" class="flex items-center">
              <Lock class="w-3.5 h-3.5 text-slate-400" />
            </span>
          </div>
        </div>
      </div>

      <!-- Options Menu (3 Dots Menu containing Guardar Publicación) -->
      <div class="relative">
        <button
          type="button"
          @click="showOptionsMenu = !showOptionsMenu"
          class="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Opciones"
          aria-label="Opciones"
        >
          <MoreHorizontal class="w-5 h-5" />
        </button>

        <div
          v-if="showOptionsMenu"
          class="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
          @click="showOptionsMenu = false"
        >
          <!-- Guardar publicación function inside 3 dots -->
          <button
            type="button"
            @click="feedStore.toggleSavePost(post.id)"
            class="w-full px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left cursor-pointer"
          >
            <Bookmark :class="['w-4 h-4', post.isSaved ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400']" />
            <div>
              <span class="font-semibold block text-slate-900">
                {{ post.isSaved ? 'Guardada en tus elementos' : 'Guardar publicación' }}
              </span>
              <span class="text-[10px] text-slate-400">
                {{ post.isSaved ? 'Toca para quitar de guardados' : 'Añadir esto a tus elementos guardados' }}
              </span>
            </div>
          </button>

          <button
            type="button"
            @click="copyDirectLink"
            class="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left cursor-pointer border-t border-slate-100"
          >
            <ExternalLink class="w-4 h-4 text-slate-400" />
            <span>Copiar enlace directo</span>
          </button>

          <button
            type="button"
            @click="showShareModal = true"
            class="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left cursor-pointer"
          >
            <Code class="w-4 h-4 text-slate-400" />
            <span>Vincular código HTML</span>
          </button>

          <button
            v-if="post.authorId === feedStore.currentUser.id"
            type="button"
            @click="feedStore.removePost(post.id)"
            class="w-full px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 text-left border-t border-slate-100 cursor-pointer"
          >
            <Trash2 class="w-4 h-4" />
            <span>Eliminar publicación</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Content -->
    <!-- A. Colored Gradient Canvas (Like Facebook) -->
    <div
      v-if="post.backgroundColor"
      class="min-h-[220px] p-8 flex items-center justify-center text-center px-6 select-none"
      :style="{ background: post.backgroundColor }"
    >
      <p
        class="text-lg sm:text-xl font-black leading-tight max-w-lg break-words uppercase tracking-wide drop-shadow-sm"
        :style="{ color: post.textColor || '#ffffff' }"
      >
        {{ post.content }}
      </p>
    </div>

    <!-- B. Regular Content Text -->
    <div v-else-if="post.content" class="px-4 pb-3">
      <p class="text-sm text-slate-800 leading-relaxed whitespace-pre-line break-words">
        {{ post.content }}
      </p>
    </div>

    <!-- 3. Linked Images Gallery (With forward/backward navigation) -->
    <div
      v-if="post.images && post.images.length > 0"
      :class="[
        'relative bg-slate-950 overflow-hidden',
        post.images.length === 1 ? 'max-h-[550px]' : 'grid grid-cols-2 gap-1 max-h-[420px]'
      ]"
    >
      <div
        v-if="post.images.length === 1"
        class="w-full flex items-center justify-center bg-slate-900 cursor-pointer overflow-hidden"
        @click="feedStore.openLightbox(post.images, 0, post)"
      >
        <SafeImage
          :src="post.images[0]"
          alt="Imagen vinculada"
          allowZoom
          @zoom="feedStore.openLightbox(post.images, 0, post)"
          imgClass="w-full max-h-[550px] object-cover hover:scale-101 transition-transform duration-300"
          containerClass="w-full"
        />
      </div>

      <template v-else>
        <div
          v-for="(img, idx) in post.images.slice(0, 4)"
          :key="idx"
          class="h-44 sm:h-52 cursor-pointer overflow-hidden bg-slate-900"
          @click="feedStore.openLightbox(post.images, idx, post)"
        >
          <SafeImage
            :src="img"
            :alt="`Imagen ${idx + 1}`"
            imgClass="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            containerClass="w-full h-full"
          />
        </div>
      </template>
    </div>

    <!-- 4. Modern Post Action Bar (Matches image.png: [👍 24] [💬 3] [↗ 1] on left, reaction icons on right) -->
    <div class="px-4 py-2.5 flex items-center justify-between border-t border-slate-100/90 relative bg-white">
      <!-- Reactions Popover (when hovering over like button) -->
      <div
        v-if="showReactionsPopover"
        class="absolute -top-12 left-2 z-40"
        @mouseenter="clearPopoverTimer"
        @mouseleave="delayHidePopover"
      >
        <FacebookReactions @select="handleSelectReaction" />
      </div>

      <!-- Left Side Actions: Like, Comment, Share with counts -->
      <div class="flex items-center gap-1 sm:gap-2">
        <!-- Like Button with Counter -->
        <div
          class="relative"
          @mouseenter="delayShowPopover"
          @mouseleave="delayHidePopover"
        >
          <button
            type="button"
            @click="handleClickReactionButton"
            :class="[
              'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:bg-slate-100 cursor-pointer',
              currentReactionConfig ? currentReactionConfig.colorClass : 'text-slate-600 hover:text-slate-900'
            ]"
            title="Me gusta / Reaccionar"
          >
            <!-- SVG Icon: unreacted outline or authentic Facebook Reaction SVG -->
            <FacebookReactionIcon
              :type="post.userReaction"
              size="xs"
              class="w-4 h-4"
            />
            <span :class="['font-bold text-xs', currentReactionConfig ? currentReactionConfig.colorClass : 'text-slate-700']">
              {{ totalReactions }}
            </span>
          </button>
        </div>

        <!-- Comment Button with Counter -> Opens Facebook-style Modal! -->
        <button
          type="button"
          @click="showCommentsModal = true"
          class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Comentar (Abre diálogo Facebook)"
        >
          <MessageCircle class="w-4 h-4 text-slate-600 stroke-[2.2]" />
          <span class="font-bold text-xs text-slate-700">{{ post.comments.length }}</span>
        </button>

        <!-- Share Button with Counter -->
        <button
          type="button"
          @click="showShareModal = true"
          class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Compartir publicación"
        >
          <Share2 class="w-4 h-4 text-slate-600 stroke-[2.2]" />
          <span class="font-bold text-xs text-slate-700">{{ post.sharesCount }}</span>
        </button>
      </div>

      <!-- Right Side: Overlapping Authentic Facebook Reaction SVGs (Matches Facebook!) -->
      <button
        type="button"
        @click="showReactionsModal = true"
        class="flex items-center hover:scale-105 transition-transform cursor-pointer pl-2 py-1"
        title="Ver todas las reacciones"
      >
        <div v-if="topReactions.length > 0" class="flex items-center -space-x-1.5">
          <FacebookReactionIcon
            v-for="t in topReactions"
            :key="t"
            :type="t"
            size="xs"
            class="ring-1.5 ring-white rounded-full drop-shadow-2xs"
          />
        </div>
        <div v-else-if="totalReactions > 0" class="flex items-center -space-x-1.5">
          <FacebookReactionIcon type="like" size="xs" class="ring-1.5 ring-white rounded-full drop-shadow-2xs" />
        </div>
      </button>
    </div>

    <!-- Modals -->
    <!-- Facebook-Style Post & Comments Dialog Modal -->
    <PostCommentsModal
      :post="post"
      :isOpen="showCommentsModal"
      @close="showCommentsModal = false"
    />

    <!-- Reactions Breakdown Modal -->
    <ReactionsModal
      :post="post"
      :isOpen="showReactionsModal"
      @close="showReactionsModal = false"
    />

    <!-- Share & Embed Modal -->
    <ShareModal
      :post="post"
      :isOpen="showShareModal"
      @close="showShareModal = false"
    />
  </article>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  MoreHorizontal,
  Globe,
  Users,
  Lock,
  MessageCircle,
  Share2,
  Bookmark,
  Trash2,
  ExternalLink,
  Code
} from 'lucide-vue-next';
import { useFeedStore } from '../store/feedStore';
import { REACTION_CONFIGS } from '../composables/useReactions';
import FacebookReactions from './FacebookReactions.vue';
import FacebookReactionIcon from './FacebookReactionIcon.vue';
import ReactionsModal from './ReactionsModal.vue';
import ShareModal from './ShareModal.vue';
import PostCommentsModal from './PostCommentsModal.vue';
import SafeImage from '@/shared/components/SafeImage.vue';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const feedStore = useFeedStore();

const showReactionsPopover = ref(false);
const showReactionsModal = ref(false);
const showShareModal = ref(false);
const showOptionsMenu = ref(false);
const showCommentsModal = ref(false);

let popoverTimer = null;

const totalReactions = computed(() => {
  return Object.values(props.post.reactions || {}).reduce((acc, c) => acc + c, 0);
});

const topReactions = computed(() => {
  return Object.keys(props.post.reactions || {})
    .filter((k) => props.post.reactions[k] > 0)
    .sort((a, b) => props.post.reactions[b] - props.post.reactions[a])
    .slice(0, 3);
});

const currentReactionConfig = computed(() => {
  return props.post.userReaction ? REACTION_CONFIGS[props.post.userReaction] : null;
});

function delayShowPopover() {
  clearPopoverTimer();
  popoverTimer = setTimeout(() => {
    showReactionsPopover.value = true;
  }, 220);
}

function delayHidePopover() {
  clearPopoverTimer();
  popoverTimer = setTimeout(() => {
    showReactionsPopover.value = false;
  }, 350);
}

function clearPopoverTimer() {
  if (popoverTimer) clearTimeout(popoverTimer);
}

function handleClickReactionButton() {
  if (props.post.userReaction) {
    feedStore.toggleReaction(props.post.id, null);
  } else {
    feedStore.toggleReaction(props.post.id, 'like');
  }
  showReactionsPopover.value = false;
}

function handleSelectReaction(type) {
  feedStore.toggleReaction(props.post.id, type);
  showReactionsPopover.value = false;
}

function copyDirectLink() {
  navigator.clipboard.writeText(`${window.location.origin}/#/feeds?post=${props.post.id}`);
  alert('¡Enlace copiado al portapapeles!');
}
</script>
