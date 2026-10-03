<template>
  <article class="feed-post-card">
    <!-- 1. Header (Author, Time, Privacy, 3-dots Menu) -->
    <div class="feed-post-header">
      <div class="feed-post-author-row">
        <RouterLink :to="`/profiles/${post.authorId}`" class="relative cursor-pointer">
          <SafeImage
            :src="post.authorAvatar"
            :alt="post.authorName"
            imgClass="w-full h-full object-cover"
            containerClass="feed-post-avatar"
          />
        </RouterLink>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap leading-tight">
            <RouterLink
              :to="`/profiles/${post.authorId}`"
              class="feed-post-author-name"
            >
              {{ post.authorName }}
            </RouterLink>

            <span
              v-if="post.authorVerified"
              title="Verificado"
              class="feed-post-verified-badge"
            >
              ✓
            </span>

            <span v-if="post.feeling" class="feed-post-feeling">
              está <span>{{ post.feeling.emoji }}</span> {{ post.feeling.text }}
            </span>
          </div>

          <div class="feed-post-meta">
            <span>{{ post.timestamp }}</span>
            <span aria-hidden="true" class="text-slate-300">·</span>
            <template v-if="post.location">
              <span class="text-slate-500 truncate max-w-40 sm:max-w-xs">{{ post.location }}</span>
              <span aria-hidden="true" class="text-slate-300">·</span>
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

      <!-- Options Menu -->
      <div class="relative">
        <button
          type="button"
          @click="showOptionsMenu = !showOptionsMenu"
          class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Opciones"
          aria-label="Opciones"
        >
          <MoreHorizontal class="w-4.5 h-4.5" />
        </button>

        <div
          v-if="showOptionsMenu"
          class="absolute right-0 top-10 w-64 bg-white rounded-md shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
          @click="showOptionsMenu = false"
        >
          <button
            type="button"
            @click="feedStore.toggleSavePost(post.id)"
            class="w-full px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 text-left cursor-pointer"
          >
            <Bookmark :class="['w-4 h-4', post.isSaved ? 'text-emerald-700 fill-emerald-700' : 'text-slate-400']" />
            <div>
              <span class="font-bold block text-slate-900">
                {{ post.isSaved ? 'Guardada en tus elementos' : 'Guardar publicación' }}
              </span>
              <span class="text-xs text-slate-400">
                {{ post.isSaved ? 'Toca para quitar de guardados' : 'Añadir esto a tus elementos guardados' }}
              </span>
            </div>
          </button>

          <button
            type="button"
            @click="copyDirectLink"
            class="w-full px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 text-left cursor-pointer border-t border-slate-100 font-medium"
          >
            <ExternalLink class="w-4 h-4 text-slate-400" />
            <span>{{ copiedLink ? '¡Enlace copiado!' : 'Copiar enlace directo' }}</span>
          </button>

          <button
            type="button"
            @click="showShareModal = true"
            class="w-full px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 text-left cursor-pointer font-medium"
          >
            <Code class="w-4 h-4 text-slate-400" />
            <span>Vincular código HTML</span>
          </button>

          <button
            v-if="post.authorId === feedStore.currentUser.id"
            type="button"
            @click="feedStore.removePost(post.id)"
            class="w-full px-4 py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 text-left border-t border-slate-100 cursor-pointer font-semibold"
          >
            <Trash2 class="w-4 h-4" />
            <span>Eliminar publicación</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Content -->
    <!-- A. Colored Gradient Canvas -->
    <div
      v-if="post.backgroundColor"
      class="feed-post-canvas"
      :style="{ background: post.backgroundColor }"
    >
      <p
        class="feed-post-canvas-text"
        :style="{ color: post.textColor || '#ffffff' }"
      >
        {{ post.content }}
      </p>
    </div>

    <!-- B. Regular Content Text -->
    <div v-else-if="post.content" class="feed-post-content">
      <p>{{ post.content }}</p>
    </div>

    <!-- 3. Linked Images Gallery -->
    <div
      v-if="post.images && post.images.length > 0"
      :class="[
        'relative bg-slate-950 overflow-hidden',
        post.images.length === 1 ? 'max-h-[550px]' : 'grid grid-cols-2 gap-1 max-h-[440px]'
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
          class="h-48 sm:h-56 cursor-pointer overflow-hidden bg-slate-900"
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

    <!-- 4. Post Action Bar -->
    <div class="feed-post-footer">
      <!-- Reactions Popover (Floating animated dock) -->
      <div
        v-if="showReactionsPopover"
        class="absolute -top-14 left-2 z-40 animate-in fade-in zoom-in-95 duration-150"
        @mouseenter="clearPopoverTimer"
        @mouseleave="delayHidePopover"
      >
        <FacebookReactions @select="handleSelectReaction" />
      </div>

      <!-- Left Side Actions: Like, Comment, Share (ONLY ICON + NUMBER, NO TEXT) -->
      <div class="feed-post-actions-group">
        <!-- Like Button with Counter ONLY -->
        <div
          class="relative"
          @mouseenter="delayShowPopover"
          @mouseleave="delayHidePopover"
        >
          <button
            type="button"
            @pointerdown="onPointerDown"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @pointerleave="onPointerUp"
            @click="onButtonClick"
            :class="[
              'feed-post-action-btn select-none active:scale-95 cursor-pointer outline-none focus:outline-none flex items-center gap-1.5',
              currentReactionConfig ? currentReactionConfig.colorClass : 'text-slate-600'
            ]"
            title="Me gusta / Reaccionar"
          >
            <FacebookReactionIcon
              :type="post.userReaction"
              size="sm"
              class="w-4.5 h-4.5 shrink-0"
            />
            <span :class="['font-bold text-xs sm:text-sm', currentReactionConfig ? currentReactionConfig.colorClass : 'text-slate-700']">
              {{ totalReactions }}
            </span>
          </button>
        </div>

        <!-- Comment Button with Counter ONLY -->
        <button
          type="button"
          @click="showCommentsModal = true"
          class="feed-post-action-btn cursor-pointer flex items-center gap-1.5"
          title="Comentarios"
        >
          <MessageCircle class="w-4.5 h-4.5 text-slate-600 stroke-[2.2]" />
          <span class="font-bold text-xs sm:text-sm text-slate-700">{{ post.comments ? post.comments.length : 0 }}</span>
        </button>

        <!-- Share Button with Counter ONLY -->
        <button
          type="button"
          @click="showShareModal = true"
          class="feed-post-action-btn cursor-pointer flex items-center gap-1.5"
          title="Compartir publicación"
        >
          <Share2 class="w-4.5 h-4.5 text-slate-600 stroke-[2.2]" />
          <span class="font-bold text-xs sm:text-sm text-slate-700">{{ post.sharesCount || 0 }}</span>
        </button>
      </div>

      <!-- Right Side: Reaction Icons Summary (Overlapping Badges + Total) -->
      <button
        v-if="totalReactions > 0"
        type="button"
        @click="showReactionsModal = true"
        class="flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer pl-2 py-1 select-none"
        title="Ver todas las reacciones"
      >
        <div class="flex items-center -space-x-1">
          <FacebookReactionIcon
            v-for="t in (topReactions.length > 0 ? topReactions : ['like'])"
            :key="t"
            :type="t"
            size="xs"
            class="w-4 h-4 ring-1 ring-white rounded-full drop-shadow-xs"
          />
        </div>
        <span class="text-xs font-bold text-slate-500 hover:text-slate-800">
          {{ totalReactions }}
        </span>
      </button>
    </div>

    <!-- Modals -->
    <PostCommentsModal
      :post="post"
      :isOpen="showCommentsModal"
      @close="showCommentsModal = false"
    />

    <ReactionsModal
      :post="post"
      :isOpen="showReactionsModal"
      @close="showReactionsModal = false"
    />

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
const copiedLink = ref(false);

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

let holdTimer = null;
let didTriggerHold = false;

function onPointerDown() {
  didTriggerHold = false;
  if (holdTimer) clearTimeout(holdTimer);
  holdTimer = setTimeout(() => {
    didTriggerHold = true;
    showReactionsPopover.value = true;
  }, 350);
}

function onPointerUp() {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
}

function onButtonClick() {
  if (didTriggerHold) {
    didTriggerHold = false;
    return;
  }
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }

  // Toggle reaction cleanly: if reacted, removes reaction; if none, gives 'like'
  if (props.post.userReaction) {
    feedStore.toggleReaction(props.post.id, null);
  } else {
    feedStore.toggleReaction(props.post.id, 'like');
  }
  showReactionsPopover.value = false;
}

function handleSelectReaction(type) {
  if (props.post.userReaction === type) {
    feedStore.toggleReaction(props.post.id, null);
  } else {
    feedStore.toggleReaction(props.post.id, type);
  }
  showReactionsPopover.value = false;
}

function copyDirectLink() {
  navigator.clipboard.writeText(`${window.location.origin}/#/feeds?post=${props.post.id}`);
  copiedLink.value = true;
  setTimeout(() => {
    copiedLink.value = false;
  }, 2000);
}
</script>
