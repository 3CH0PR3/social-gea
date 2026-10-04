export default [
  {
    path: 'marketplace',
    name: 'social.shop',
    component: () => import('../view/MarketplaceView.vue'),
    meta: { title: 'Premios y Recompensas' },
  },
  {
    path: 'shop',
    name: 'social.shop.alt',
    component: () => import('../view/MarketplaceView.vue'),
    meta: { title: 'Premios y Recompensas' },
  },
];
