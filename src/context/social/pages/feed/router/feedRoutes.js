export const feedRoutes = [
  {
    path: '',
    name: 'social.feed.home',
    component: () => import('../view/FeedView.vue'),
  },
  {
    path: 'feeds',
    name: 'social.feed',
    component: () => import('../view/FeedView.vue'),
  },
];

export default feedRoutes;
