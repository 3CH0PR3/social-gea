import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { INITIAL_USERS } from '@/shared/data/initialData';

export const useMessengerStore = defineStore('social.messenger', () => {
  const conversations = ref([
    {
      id: 'conv_1',
      user: INITIAL_USERS[1],
      unread: 2,
      messages: [
        { id: 'm1', text: '¡Hola Carlos! ¿Tienes botellas PET disponibles?', isMe: false, timestamp: '10:30 AM' },
        { id: 'm2', text: 'Hola Valentina. Sí, tengo unos 12 kg listos para entrega.', isMe: true, timestamp: '10:32 AM' },
        { id: 'm3', text: '¡Genial! Pasaré por el centro de acopio a las 3:00 PM.', isMe: false, timestamp: '10:35 AM' },
      ],
    },
    {
      id: 'conv_2',
      user: INITIAL_USERS[2],
      unread: 0,
      messages: [
        { id: 'm4', text: 'Gracias por clasificar el cartón, ya sumaste tus EcoPuntos.', isMe: false, timestamp: 'Ayer' },
      ],
    },
  ]);

  const activeConversationId = ref(null);
  const isDrawerOpen = ref(false);

  // Computeds
  const activeConversation = computed(() => {
    return conversations.value.find((c) => c.id === activeConversationId.value) || null;
  });

  const totalUnreadCount = computed(() => {
    return conversations.value.reduce((total, c) => total + (c.unread || 0), 0);
  });

  // Methods
  const openChatWith = (user) => {
    let conv = conversations.value.find((c) => c.user.id === user.id);
    if (!conv) {
      conv = {
        id: 'conv_' + Date.now(),
        user,
        unread: 0,
        messages: [],
      };
      conversations.value.unshift(conv);
    }
    activeConversationId.value = conv.id;
    conv.unread = 0;
    isDrawerOpen.value = true;
  };

  const closeDrawer = () => {
    isDrawerOpen.value = false;
  };

  const sendMessage = (text) => {
    if (!text.trim() || !activeConversation.value) return;

    activeConversation.value.messages.push({
      id: 'msg_' + Date.now(),
      text: text.trim(),
      isMe: true,
      timestamp: 'Ahora',
    });
  };

  const loadConversations = () => {
    // Already populated or can fetch from API
  };

  return {
    conversations,
    activeConversationId,
    isDrawerOpen,
    activeConversation,
    totalUnreadCount,
    openChatWith,
    closeDrawer,
    sendMessage,
    loadConversations,
  };
});
