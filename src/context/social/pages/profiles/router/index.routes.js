export default [
  {
    path: 'profiles/:id?',
    name: 'social.profiles',
    component: () => import('../view/ProfileView.vue'),
    meta: { title: 'Perfil', mobileFullSheet: true },
  },
];
