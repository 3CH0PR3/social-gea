export default [
  {
    path: 'messenger',
    alias: 'messages',
    name: 'social.messages',
    component: () => import('../view/MessengerView.vue'),
    meta: { title: 'Mensajes' },
  },
];
