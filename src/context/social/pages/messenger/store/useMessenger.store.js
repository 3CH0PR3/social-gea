import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { CURRENT_USER, INITIAL_USERS } from '@/shared/data/initialData';

export const useMessengerStore = defineStore('social.messenger', () => {
  const currentUser = ref(CURRENT_USER);
  const conversations = ref([
    {
      id: 'conv_1',
      participant: INITIAL_USERS[1],
      user: INITIAL_USERS[1],
      unread: 2,
      messages: [
        {
          id: 'm1',
          senderId: INITIAL_USERS[1]?.id || 'user_2',
          text: '¡Hola Carlos! ¿Tienes botellas PET disponibles para entrega?',
          isMe: false,
          timestamp: '10:30 AM',
        },
        {
          id: 'm2',
          senderId: CURRENT_USER.id,
          text: 'Hola Valentina. Sí, tengo unos 12 kg listos para entrega.',
          isMe: true,
          timestamp: '10:32 AM',
        },
        {
          id: 'm3',
          senderId: INITIAL_USERS[1]?.id || 'user_2',
          text: '¡Genial! Pasaré por el centro de acopio a las 3:00 PM.',
          isMe: false,
          timestamp: '10:35 AM',
        },
      ],
    },
    {
      id: 'conv_2',
      participant: INITIAL_USERS[2],
      user: INITIAL_USERS[2],
      unread: 0,
      messages: [
        {
          id: 'm4',
          senderId: INITIAL_USERS[2]?.id || 'user_3',
          text: 'Gracias por clasificar el cartón, ya sumaste tus EcoPuntos.',
          isMe: false,
          timestamp: 'Ayer',
        },
      ],
    },
  ]);

  const activeConversationId = ref('conv_1');
  const activeChatUser = ref(null);
  const isDrawerOpen = ref(false);
  const isLoading = ref(false);

  // Computeds
  const currentConversation = computed(() => {
    if (!activeConversationId.value && conversations.value.length > 0) {
      return conversations.value[0];
    }
    return (
      conversations.value.find((c) => c.id === activeConversationId.value) ||
      conversations.value[0] ||
      null
    );
  });

  const activeConversation = currentConversation; // alias

  const unreadCount = computed(() => {
    return conversations.value.reduce((total, c) => total + (c.unread || 0), 0);
  });

  const totalUnreadCount = unreadCount; // alias

  // Methods
  const openWithUser = (user) => {
    if (!user) return;
    activeChatUser.value = user;

    let conv = conversations.value.find(
      (c) => c.user?.id === user.id || c.participant?.id === user.id
    );

    if (!conv) {
      conv = {
        id: 'conv_' + Date.now(),
        participant: user,
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

  const openChatWithUser = openWithUser;
  const openChatWith = openWithUser;

  const closeDrawer = () => {
    isDrawerOpen.value = false;
  };

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
  };

  const sendMessage = (arg1, arg2, arg3) => {
    // Overloaded:
    // 1. sendMessage(text)
    // 2. sendMessage(userId, text, mediaUrl)
    let text = '';
    let mediaUrl = null;
    let targetUserId = null;

    if (arg2 !== undefined) {
      targetUserId = arg1;
      text = typeof arg2 === 'string' ? arg2.trim() : '';
      mediaUrl = arg3 || null;
    } else {
      text = typeof arg1 === 'string' ? arg1.trim() : '';
    }

    if (!text && !mediaUrl) return;

    let targetConv = null;
    if (targetUserId) {
      targetConv = conversations.value.find(
        (c) => c.user?.id === targetUserId || c.participant?.id === targetUserId
      );
      if (!targetConv) {
        targetConv = {
          id: 'conv_' + Date.now(),
          participant: { id: targetUserId, name: 'Usuario', avatar: '' },
          user: { id: targetUserId, name: 'Usuario', avatar: '' },
          unread: 0,
          messages: [],
        };
        conversations.value.unshift(targetConv);
      }
    } else {
      targetConv = currentConversation.value;
    }

    if (targetConv) {
      targetConv.messages.push({
        id: 'msg_' + Date.now(),
        senderId: currentUser.value.id,
        text,
        mediaUrl,
        isMe: true,
        timestamp: 'Ahora',
      });
    }
  };

  const loadConversations = () => {
    // Ready
  };

  return {
    currentUser,
    conversations,
    activeConversationId,
    activeChatUser,
    isDrawerOpen,
    isLoading,
    currentConversation,
    activeConversation,
    unreadCount,
    totalUnreadCount,
    openWithUser,
    openChatWithUser,
    openChatWith,
    closeDrawer,
    toggleDrawer,
    sendMessage,
    loadConversations,
  };
});
