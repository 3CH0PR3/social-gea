<template>
  <div
    v-if="isDrawerOpen"
    class="fixed bottom-0 right-4 sm:right-8 z-40 w-full max-w-sm sm:w-88 bg-white rounded-t-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 animate-in slide-in-from-bottom-5"
  >
    <!-- Header -->
    <div class="bg-gradient-to-r from-emerald-700 to-teal-800 p-3 text-white flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-2.5">
        <div v-if="participant" class="relative">
          <SafeImage
            :src="participant.avatar"
            :alt="participant.name"
            imgClass="w-8 h-8 rounded-full object-cover ring-1 ring-white/50"
            containerClass="w-8 h-8 rounded-full"
          />
          <span
            v-if="participant.isOnline"
            class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"
          />
        </div>
        <div class="leading-tight">
          <h4 class="text-xs font-bold text-white truncate max-w-[150px]">
            {{ participant?.name || 'Mensajes' }}
          </h4>
          <span class="text-[10px] text-emerald-200">
            {{ participant?.isOnline ? 'En línea ahora' : 'Desconectado' }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button
          type="button"
          @click="isMinimized = !isMinimized"
          class="p-1 rounded-lg hover:bg-white/10 text-white/90 cursor-pointer"
          title="Minimizar"
        >
          <Minus class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="messengerStore.closeDrawer"
          class="p-1 rounded-lg hover:bg-white/10 text-white/90 cursor-pointer"
          title="Cerrar chat"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <template v-if="!isMinimized">
      <!-- Messages stream -->
      <div class="h-72 overflow-y-auto p-3 space-y-2 bg-slate-50/60 flex flex-col">
        <ChatMessage
          v-for="msg in currentConversation?.messages || []"
          :key="msg.id"
          :message="msg"
          :isMe="msg.senderId === messengerStore.currentUser.id"
        />
      </div>

      <!-- Media URL Input drawer -->
      <div v-if="showMediaInput" class="p-2 border-t border-slate-100 bg-emerald-50/50 flex items-center gap-2 text-xs">
        <input
          type="url"
          v-model="mediaUrl"
          placeholder="Pega la URL de una foto..."
          class="flex-1 text-[11px] bg-white border border-slate-300 rounded-lg px-2 py-1 outline-none"
        />
        <button
          type="button"
          @click="showMediaInput = false"
          class="text-xs text-slate-500 font-semibold px-2 py-1 cursor-pointer"
        >
          Cerrar
        </button>
      </div>

      <!-- Composer -->
      <form @submit.prevent="handleSend" class="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5">
        <button
          type="button"
          @click="showMediaInput = !showMediaInput"
          class="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer"
          title="Adjuntar imagen por URL"
        >
          <ImageIcon class="w-4 h-4" />
        </button>

        <input
          type="text"
          v-model="textInput"
          placeholder="Escribe un mensaje..."
          class="flex-1 text-xs bg-slate-100 hover:bg-slate-200/60 focus:bg-white border border-transparent focus:border-emerald-500 rounded-full px-3 py-2 outline-none transition-all"
        />

        <button
          v-if="textInput.trim() || mediaUrl.trim()"
          type="submit"
          class="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors cursor-pointer"
        >
          <Send class="w-3.5 h-3.5" />
        </button>
        <button
          v-else
          type="button"
          @click="sendThumbsUp"
          class="p-2 text-emerald-600 hover:scale-120 transition-transform active:scale-95 cursor-pointer"
          title="Enviar Me gusta"
        >
          <ThumbsUp class="w-4 h-4 fill-emerald-600" />
        </button>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  X,
  Minus,
  Send,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-vue-next';
import { useMessenger } from '../composables/useMessenger';
import { useMessengerStore } from '../store/messengerStore';
import ChatMessage from './ChatMessage.vue';
import SafeImage from '@/shared/components/SafeImage.vue';

const { isDrawerOpen, currentConversation, activeChatUser } = useMessenger();
const messengerStore = useMessengerStore();

const isMinimized = ref(false);
const textInput = ref('');
const mediaUrl = ref('');
const showMediaInput = ref(false);

const participant = computed(() => {
  return activeChatUser.value || currentConversation.value?.participant || null;
});

function handleSend() {
  if (!textInput.value.trim() && !mediaUrl.value.trim()) return;
  if (!participant.value) return;

  messengerStore.sendMessage(participant.value.id, textInput.value.trim(), mediaUrl.value.trim() || null);
  textInput.value = '';
  mediaUrl.value = '';
  showMediaInput.value = false;
}

function sendThumbsUp() {
  if (!participant.value) return;
  messengerStore.sendMessage(participant.value.id, '👍');
}
</script>
