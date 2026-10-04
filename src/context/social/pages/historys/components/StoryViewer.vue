<template>
  <Teleport to="body">
    <div
      v-if="viewer.isOpen && currentStory"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none"
    >
    <!-- Floating Emojis -->
    <span
      v-for="f in floatingEmojis"
      :key="f.id"
      class="fixed pointer-events-none text-4xl animate-bounce z-50 transition-all duration-1000"
      :style="{
        bottom: '120px',
        left: `${f.left}%`,
        transform: 'translateY(-100px)',
        opacity: 0.9,
      }"
    >
      {{ f.emoji }}
    </span>

    <!-- Navigation Chevrons (Desktop) -->
    <button
      @click="prevStory"
      :disabled="currentStoryIdx === 0 && currentItemIdx === 0"
      class="hidden md:flex absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 backdrop-blur-md transition-colors z-40 cursor-pointer"
      aria-label="Historia anterior"
    >
      <ChevronLeft class="w-6 h-6" />
    </button>

    <button
      @click="nextStory"
      class="hidden md:flex absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors z-40 cursor-pointer"
      aria-label="Siguiente historia"
    >
      <ChevronRight class="w-6 h-6" />
    </button>

    <!-- Story Container (Opens completely: 100dvh full-screen on mobile, immersive viewport on desktop) -->
    <div class="relative w-full h-[100dvh] sm:h-full sm:max-h-[96vh] sm:max-w-[460px] bg-black sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col border-0 sm:border sm:border-white/10 select-none animate-in fade-in duration-200">
      <!-- Top Scrim Gradient (Ensures author name and time are 100% visible on any background) -->
      <div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/90 via-black/55 to-transparent z-25 pointer-events-none" />

      <!-- Segmented Progress Bars -->
      <div class="absolute top-2.5 left-3 right-3 z-30 flex items-center gap-1.5">
        <div
          v-for="(it, idx) in currentStory.items"
          :key="it.id"
          class="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-xs"
        >
          <div
            class="h-full bg-white transition-all duration-75 ease-linear rounded-full"
            :style="{
              width: idx < currentItemIdx ? '100%' : idx === currentItemIdx ? `${progress}%` : '0%'
            }"
          />
        </div>
      </div>

      <!-- Header (Author info + Play/Pause & Close X integrated seamlessly with high contrast) -->
      <div class="absolute top-5 left-3.5 right-3.5 z-30 flex items-center justify-between text-white select-none">
        <div class="flex items-center gap-2.5">
          <img
            :src="currentStory.authorAvatar"
            :alt="currentStory.authorName"
            class="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500 shadow-md"
          />
          <div>
            <h4 class="text-sm font-extrabold tracking-tight leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              {{ currentStory.authorName }}
            </h4>
            <span class="text-[11.5px] text-white/95 font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] block mt-0.5">
              {{ currentItem?.createdAt || 'Reciente' }}
            </span>
          </div>
        </div>

        <!-- Integrated Header Controls: Play/Pause and Close X -->
        <div class="flex items-center gap-1.5 z-40">
          <button
            type="button"
            @click.stop="isPaused = !isPaused"
            class="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer"
            :title="isPaused ? 'Reanudar' : 'Pausar'"
          >
            <Play v-if="isPaused" class="w-4 h-4 fill-white" />
            <Pause v-else class="w-4 h-4" />
          </button>
          <button
            type="button"
            @click.stop="historyStore.closeStoryViewer"
            class="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer"
            title="Cerrar historia"
          >
            <X class="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      <!-- Tap Zones -->
      <div class="absolute inset-0 z-10 flex">
        <div class="w-1/3 h-full cursor-pointer" @click="prevStory" />
        <div class="w-2/3 h-full cursor-pointer" @click="nextStory" />
      </div>

      <!-- Media Canvas -->
      <div class="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-black">
        <!-- Text-only Story -->
        <div
          v-if="currentItem?.type === 'text'"
          class="w-full h-full flex flex-col items-center justify-center p-8 text-center"
          :style="{
            background: currentItem.backgroundColor || 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          }"
        >
          <p
            class="text-2xl md:text-3xl font-bold leading-relaxed max-w-xs break-words"
            :style="{ color: currentItem.textColor || '#ffffff' }"
          >
            {{ currentItem.textContent }}
          </p>
        </div>

        <!-- Image Story (Image covers container, text caption overlaid on bottom) -->
        <div v-else class="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
          <SafeImage
            :src="currentItem?.mediaUrl"
            alt="Historia"
            containerClass="absolute inset-0 w-full h-full flex items-center justify-center bg-black"
            imgClass="w-full h-full object-cover"
            fallbackText="Imagen de historia"
          />

          <!-- Text Caption: ALWAYS OVER the media ('por encima') and positioned at the bottom ('abajo') -->
          <div
            v-if="currentItem?.textContent"
            class="absolute bottom-5 left-0 right-0 z-20 px-4 text-center pointer-events-none"
          >
            <span class="inline-block px-4 py-2 rounded-xl bg-black/65 backdrop-blur-md text-white text-sm sm:text-base font-semibold leading-relaxed max-w-[90%] break-words drop-shadow-md">
              {{ currentItem.textContent }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bottom Bar (100% pure black bg-black, no blue tint) -->
      <!-- Case A: MY STORY -> Viewers count & Delete option. NO reactions and NO self-reply -->
      <div
        v-if="isMyStory"
        class="relative z-30 px-4 py-3 bg-black border-t border-white/10 flex items-center justify-between"
      >
        <button
          type="button"
          @click.stop="openViewersSheet"
          class="flex items-center gap-2 text-xs font-bold text-white/95 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 px-3.5 py-1.5 rounded-full transition-all cursor-pointer border border-white/10 shadow-xs"
        >
          <Eye class="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{{ currentItem?.viewersCount || (viewersData?.length || 0) }} visualizaciones</span>
          <ChevronUp class="w-3.5 h-3.5 text-white/70 ml-0.5 shrink-0" />
        </button>

        <button
          type="button"
          @click="handleDeleteItem"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-red-500/80 text-white/90 hover:text-white text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
          title="Eliminar esta historia"
        >
          <Trash2 class="w-3.5 h-3.5" />
          <span>Eliminar</span>
        </button>
      </div>

      <!-- Case B: OTHER USERS' STORIES -> Reactions & Quick Reply -->
      <div
        v-else
        class="relative z-30 p-3 bg-black border-t border-white/10 flex flex-col gap-2"
      >
        <div class="flex items-center justify-between px-2 pt-1">
          <button
            v-for="emoji in ['❤️', '😂', '😮', '😢', '🔥', '👏']"
            :key="emoji"
            type="button"
            @click="triggerReaction(emoji)"
            class="text-2xl hover:scale-130 transition-transform active:scale-95 focus:outline-none cursor-pointer"
          >
            {{ emoji }}
          </button>
        </div>

        <form @submit.prevent="sendReply" class="flex items-center gap-2">
          <input
            type="text"
            v-model="replyText"
            @focus="isPaused = true"
            @blur="isPaused = false"
            :placeholder="`Responder a ${currentStory.authorName}...`"
            class="flex-1 bg-white/15 hover:bg-white/20 focus:bg-white/25 text-white placeholder-white/70 text-xs px-3.5 py-2.5 rounded-full outline-none border border-white/20 focus:border-emerald-400 transition-colors"
          />
          <button
            type="submit"
            :disabled="!replyText.trim()"
            class="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
          >
            <Send class="w-4 h-4" />
          </button>
        </form>
      </div>

      <!-- Story Viewers Bottom Sheet (Smooth Slide-Up Drawer) -->
      <StoryViewersSheet
        :isOpen="isViewersSheetOpen"
        :viewers="viewersData"
        @close="closeViewersSheet"
        @select-user="handleSelectViewer"
      />
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { X, ChevronLeft, ChevronRight, ChevronUp, Pause, Play, Send, Eye, Trash2 } from 'lucide-vue-next';
import { useHistorys } from '../composables/useHistorys';
import { useHistoryStore } from '../store/historyStore';
import { useMessengerStore } from '@/context/social/pages/messenger/store/messengerStore';
import { useBodyScrollLock } from '@/shared/composables/useBodyScrollLock';
import StoryViewersSheet from './StoryViewersSheet.vue';
import SafeImage from '@/shared/components/SafeImage.vue';
import viewersData from '@/shared/data/storyViewers.json';

const router = useRouter();
const { stories, viewer } = useHistorys();
const historyStore = useHistoryStore();
const messengerStore = useMessengerStore();

useBodyScrollLock(() => viewer.value?.isOpen);

const currentStoryIdx = ref(0);
const currentItemIdx = ref(0);
const isPaused = ref(false);
const isViewersSheetOpen = ref(false);
const progress = ref(0);
const replyText = ref('');
const floatingEmojis = ref([]);

function openViewersSheet() {
  isPaused.value = true;
  isViewersSheetOpen.value = true;
}

function closeViewersSheet() {
  isViewersSheetOpen.value = false;
  isPaused.value = false;
}

function handleSelectViewer(user) {
  closeViewersSheet();
  historyStore.closeStoryViewer();
  router.push(`/profiles/${user.id}`);
}

let animFrame = null;
let startTime = Date.now();
let pausedProgress = 0;
const DURATION = 5000;

const currentStory = computed(() => stories.value[currentStoryIdx.value] || null);
const currentItem = computed(() => currentStory.value?.items[currentItemIdx.value] || null);

const isMyStory = computed(() => {
  if (!currentStory.value) return false;
  return (
    currentStory.value.authorId === historyStore.currentUser?.id ||
    currentStory.value.authorName === 'Tu historia' ||
    currentStory.value.authorName === historyStore.currentUser?.name
  );
});

function handleDeleteItem() {
  if (!currentStory.value || !currentItem.value) return;
  const storyId = currentStory.value.id;
  const itemId = currentItem.value.id;
  historyStore.deleteStoryItem(storyId, itemId);
}

watch(() => viewer.value.isOpen, (open) => {
  if (open) {
    currentStoryIdx.value = viewer.value.initialIndex;
    currentItemIdx.value = 0;
    progress.value = 0;
    pausedProgress = 0;
    isPaused.value = false;
    startTimer();
  } else {
    stopTimer();
  }
});

function startTimer() {
  stopTimer();
  startTime = Date.now() - (pausedProgress / 100) * DURATION;

  const tick = () => {
    if (isPaused.value) {
      animFrame = requestAnimationFrame(tick);
      return;
    }
    const elapsed = Date.now() - startTime;
    const pct = Math.min(100, (elapsed / DURATION) * 100);
    progress.value = pct;
    pausedProgress = pct;

    if (pct >= 100) {
      nextStory();
    } else {
      animFrame = requestAnimationFrame(tick);
    }
  };

  animFrame = requestAnimationFrame(tick);
}

function stopTimer() {
  if (animFrame) cancelAnimationFrame(animFrame);
}

function nextStory() {
  progress.value = 0;
  pausedProgress = 0;
  startTime = Date.now();

  if (currentItemIdx.value < (currentStory.value?.items?.length || 0) - 1) {
    currentItemIdx.value++;
    startTimer();
  } else if (currentStoryIdx.value < stories.value.length - 1) {
    currentStoryIdx.value++;
    currentItemIdx.value = 0;
    startTimer();
  } else {
    historyStore.closeStoryViewer();
  }
}

function prevStory() {
  progress.value = 0;
  pausedProgress = 0;
  startTime = Date.now();

  if (currentItemIdx.value > 0) {
    currentItemIdx.value--;
    startTimer();
  } else if (currentStoryIdx.value > 0) {
    currentStoryIdx.value--;
    const prev = stories.value[currentStoryIdx.value];
    currentItemIdx.value = prev?.items?.length ? prev.items.length - 1 : 0;
    startTimer();
  }
}

function triggerReaction(emoji) {
  const id = Date.now() + Math.random();
  floatingEmojis.value.push({ id, emoji, left: 30 + Math.random() * 40 });
  messengerStore.sendMessage(currentStory.value.authorId, `Reaccionó con ${emoji} a tu historia`);
  setTimeout(() => {
    floatingEmojis.value = floatingEmojis.value.filter((it) => it.id !== id);
  }, 1400);
}

function sendReply() {
  if (!replyText.value.trim() || !currentStory.value) return;
  messengerStore.sendMessage(currentStory.value.authorId, replyText.value.trim());
  replyText.value = '';
  triggerReaction('💬');
}

function handleKey(e) {
  if (!viewer.value.isOpen) return;
  if (e.key === 'Escape') historyStore.closeStoryViewer();
  if (e.key === 'ArrowRight') nextStory();
  if (e.key === 'ArrowLeft') prevStory();
  if (e.key === ' ') {
    e.preventDefault();
    isPaused.value = !isPaused.value;
  }
}

onMounted(() => window.addEventListener('keydown', handleKey));
onUnmounted(() => {
  stopTimer();
  window.removeEventListener('keydown', handleKey);
});
</script>
