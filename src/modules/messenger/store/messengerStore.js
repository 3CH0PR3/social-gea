import { defineStore } from 'pinia';
import { messengerService } from '../services/messengerService';
import { CURRENT_USER, MOCK_USERS } from '@/shared/data/initialData';

export const useMessengerStore = defineStore('messenger', {
  state: () => ({
    conversations: [],
    activeChatUser: null,
    isDrawerOpen: false,
    currentUser: CURRENT_USER,
    isLoading: false,
  }),

  getters: {
    unreadCount: (state) => {
      return state.conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
    },

    currentConversation: (state) => {
      if (state.activeChatUser) {
        return state.conversations.find((c) => c.participant.id === state.activeChatUser.id);
      }
      return state.conversations[0] || null;
    },
  },

  actions: {
    async loadConversations() {
      if (this.conversations.length > 0) return;
      this.isLoading = true;
      try {
        this.conversations = await messengerService.fetchConversations();
      } finally {
        this.isLoading = false;
      }
    },

    openWithUser(user) {
      this.activeChatUser = user;
      this.isDrawerOpen = true;

      // Ensure conversation exists
      let conv = this.conversations.find((c) => c.participant.id === user.id);
      if (!conv) {
        conv = {
          id: `chat_${Date.now()}`,
          participant: user,
          unreadCount: 0,
          messages: [],
        };
        this.conversations.unshift(conv);
      }
      conv.unreadCount = 0;
    },

    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
      if (this.isDrawerOpen && !this.activeChatUser && this.conversations.length > 0) {
        this.activeChatUser = this.conversations[0].participant;
      }
    },

    closeDrawer() {
      this.isDrawerOpen = false;
    },

    async sendMessage(recipientId, text, mediaUrl = null) {
      const sentMessage = await messengerService.sendMessage(recipientId, text, mediaUrl, this.currentUser.id);

      let conv = this.conversations.find((c) => c.participant.id === recipientId);
      if (!conv) {
        const participantUser = MOCK_USERS.find((u) => u.id === recipientId) || MOCK_USERS[0];
        conv = {
          id: `chat_${Date.now()}`,
          participant: participantUser,
          unreadCount: 0,
          messages: [],
        };
        this.conversations.unshift(conv);
      }

      conv.messages.push(sentMessage);

      // Simulated auto-reply
      setTimeout(() => {
        const replies = [
          '¡Hola Carlos! Me alegra que me escribas por Conecta Radar.',
          '¡Excelente publicación! La nueva interfaz con Vue 3 quedó genial.',
          '¡Totalmente de acuerdo! Nos vemos en el próximo evento.',
          '👍',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        conv.messages.push({
          id: `reply_${Date.now()}`,
          senderId: recipientId,
          text: randomReply,
          timestamp: 'Justo ahora',
        });
      }, 1200);
    },
  },
});
