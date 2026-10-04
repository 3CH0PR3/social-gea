import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { INITIAL_USERS } from '@/shared/data/initialData';

export const useNotificationsStore = defineStore('social.notifications', () => {
  const notifications = ref([
    {
      id: 'notif_1',
      type: 'like',
      user: INITIAL_USERS[1],
      text: 'le gustó tu publicación sobre reciclaje de PET.',
      time: 'Hace 5 minutos',
      unread: true,
      targetId: 'post_1',
    },
    {
      id: 'notif_2',
      type: 'points',
      user: { name: 'Recicladora Metropolitana', avatar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150' },
      text: 'te acreditó +370 EcoPuntos por entrega de 18.5 kg de PET.',
      time: 'Hace 2 horas',
      unread: true,
      targetId: null,
    },
    {
      id: 'notif_3',
      type: 'comment',
      user: INITIAL_USERS[2],
      text: 'comentó: "Excelente iniciativa, me sumo al punto de acopio".',
      time: 'Ayer',
      unread: false,
      targetId: 'post_1',
    },
  ]);

  const filter = ref('all'); // 'all' | 'unread'
  const isLoading = ref(false);
  const errorMsg = ref(null);

  const unreadCount = computed(() => {
    return notifications.value.filter((n) => n.unread).length;
  });

  const filteredNotifications = computed(() => {
    if (filter.value === 'unread') {
      return notifications.value.filter((n) => n.unread);
    }
    return notifications.value;
  });

  const setFilter = (newFilter) => {
    filter.value = newFilter;
  };

  const markAllAsRead = () => {
    notifications.value.forEach((n) => {
      n.unread = false;
    });
  };

  const markAsRead = (id) => {
    const notif = notifications.value.find((n) => n.id === id);
    if (notif) notif.unread = false;
  };

  const loadNotifications = () => {
    // Already loaded
  };

  return {
    notifications,
    filter,
    filteredNotifications,
    unreadCount,
    isLoading,
    errorMsg,
    setFilter,
    markAllAsRead,
    markAsRead,
    loadNotifications,
  };
});

export const useNotificationStore = useNotificationsStore;
