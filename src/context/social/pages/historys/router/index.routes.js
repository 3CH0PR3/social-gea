export default [
  {
    path: 'historys',
    name: 'social.stories',
    component: () => import('../view/HistoryView.vue'),
    meta: { title: 'Historias de amigos', mobileFullSheet: true },
  },
  {
    path: 'stories',
    name: 'social.stories.alt',
    component: () => import('../view/HistoryView.vue'),
    meta: { title: 'Historias de amigos', mobileFullSheet: true },
  },
];
