export const marketplaceRoutes = [
  {
    path: '/marketplace',
    name: 'marketplace',
    component: () => import('../view/MarketplaceView.vue'),
    meta: { title: 'Premios y Recompensas' },
  },
];

export default marketplaceRoutes;
