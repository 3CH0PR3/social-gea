<template>
  <div class="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden flex flex-col md:flex-row h-[75vh] animate-in fade-in duration-200">
    <!-- Left Conversation List -->
    <div class="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-900 font-display">Chats</h2>
        <span class="text-xs text-slate-400 font-medium">{{ conversations.length }} activos</span>
      </div>

      <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
        <div
          v-for="c in conversations"
          :key="c.id"
          @click="selectConversation(c.participant)"
          :class="[
            'p-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer',
            selectedUser?.id === c.participant.id ? 'bg-emerald-50/50' : ''
          ]"
        >
          <div class="relative shrink-0">
            <SafeImage
              :src="c.participant.avatar"
              :alt="c.participant.name"
              imgClass="w-11 h-11 rounded-full object-cover"
              containerClass="w-11 h-11 rounded-full"
            />
            <span
              v-if="c.participant.isOnline"
              class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
            />
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-slate-900 truncate">{{ c.participant.name }}</h4>
            <p class="text-[11px] text-slate-500 truncate mt-0.5">
              {{ (c.messages && c.messages.length) ? c.messages[c.messages.length - 1]?.text : 'Conversación iniciada' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Chat Area -->
    <div class="flex-1 flex flex-col bg-slate-50/50">
      <div v-if="selectedUser" class="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <SafeImage
            :src="selectedUser.avatar"
            :alt="selectedUser.name"
            imgClass="w-9 h-9 rounded-full object-cover"
            containerClass="w-9 h-9 rounded-full"
          />
          <div>
            <h4 class="text-xs font-bold text-slate-900">{{ selectedUser.name }}</h4>
            <span class="text-[10px] text-emerald-600 font-medium">
              {{ selectedUser.isOnline ? 'En línea ahora' : 'Desconectado' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Messages Stream -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        <ChatMessage
          v-for="msg in currentConversation?.messages || []"
          :key="msg.id"
          :message="msg"
          :isMe="msg.senderId === messengerStore.currentUser.id"
        />
      </div>

      <!-- Composer -->
      <form @submit.prevent="handleSend" class="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          v-model="inputMsg"
          placeholder="Escribe un mensaje..."
          class="flex-1 text-xs bg-slate-100 hover:bg-slate-200/60 focus:bg-white border border-transparent focus:border-emerald-500 rounded-full px-4 py-2.5 outline-none transition-all"
        />
        <button
          type="submit"
          :disabled="!inputMsg.trim()"
          class="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-full transition-colors cursor-pointer"
        >
          <Send class="w-4 h-4" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Send } from 'lucide-vue-next';
import { useMessenger } from '../composables/useMessenger';
import { useMessengerStore } from '../store/messengerStore';
import ChatMessage from '../components/ChatMessage.vue';
import SafeImage from '@/shared/components/SafeImage.vue';

const { conversations, currentConversation, activeChatUser, loadConversations } = useMessenger();
const messengerStore = useMessengerStore();

const inputMsg = ref('');

onMounted(() => {
  loadConversations();
});

const selectedUser = computed(() => {
  return activeChatUser.value || conversations.value[0]?.participant || null;
});

function selectConversation(user) {
  messengerStore.openWithUser(user);
}

function handleSend() {
  if (!inputMsg.value.trim() || !selectedUser.value) return;
  messengerStore.sendMessage(selectedUser.value.id, inputMsg.value.trim());
  inputMsg.value = '';
}
</script>
