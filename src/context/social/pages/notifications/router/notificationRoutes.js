export const notificationRoutes = [
  {
    path: 'notifications',
    name: 'social.notifications',
    component: () => import('../view/NotificationView.vue'),
    meta: { title: 'Notificaciones' },
  },
];

export default notificationRoutes;
