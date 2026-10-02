import FeedView from '../view/FeedView.vue';

export const feedRoutes = [
  {
    path: '/',
    name: 'home',
    component: FeedView,
  },
  {
    path: '/feeds',
    name: 'feeds',
    component: FeedView,
  },
];
