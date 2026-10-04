import { INITIAL_CHATS } from '@/shared/data/initialData';

export const messengerService = {
  async fetchConversations() {
    return Promise.resolve([...INITIAL_CHATS]);
  },

  async sendMessage(recipientId, text, mediaUrl = null, senderId = 'user_current') {
    return Promise.resolve({
      id: `msg_${Date.now()}`,
      senderId,
      text,
      mediaUrl,
      timestamp: 'Justo ahora',
    });
  }
};
