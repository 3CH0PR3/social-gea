export default [
  {
    path: 'radar',
    alias: ['friends', 'explore'],
    name: 'social.explore',
    component: () => import('../view/RadarView.vue'),
    meta: { title: 'Amigos y Conexiones' },
  },
];
