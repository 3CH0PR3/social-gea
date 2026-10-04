export const profileRoutes = [
  {
    path: 'profiles/:id?',
    name: 'social.profiles',
    component: () => import('../view/ProfileView.vue'),
    meta: { mobileFullSheet: true },
  },
];

export default profileRoutes;
