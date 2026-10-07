export default [
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
