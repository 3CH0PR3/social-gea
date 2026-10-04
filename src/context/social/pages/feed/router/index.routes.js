export default [
  {
    path: '',
    name: 'social.feed.home',
    component: () => import('../view/FeedView.vue'),
    meta: { title: 'Feeds' },
  },
  {
    path: 'feeds',
    name: 'social.feed',
    component: () => import('../view/FeedView.vue'),
    meta: { title: 'Feeds' },
  },
  {
    path: 'feed',
    name: 'social.feed.alt',
    component: () => import('../view/FeedView.vue'),
    meta: { title: 'Feeds' },
  },
];
