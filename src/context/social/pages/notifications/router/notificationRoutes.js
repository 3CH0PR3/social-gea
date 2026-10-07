export const notificationRoutes = [
  {
    path: 'notifications',
    name: 'social.notifications',
    component: () => import('../view/NotificationView.vue'),
    meta: {
      title: 'Notificaciones',
      mobileFullSheet: true,
    },
  },
];

export default notificationRoutes;
