import ProfileView from '../view/ProfileView.vue';

export const profileRoutes = [
  {
    path: '/profiles/:id?',
    name: 'profiles',
    component: ProfileView,
  },
];
