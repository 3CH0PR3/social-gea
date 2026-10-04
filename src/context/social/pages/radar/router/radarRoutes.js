export const radarRoutes = [
  {
    path: '/radar',
    alias: '/friends',
    name: 'radar',
    component: () => import('../view/RadarView.vue'),
  },
];

export default radarRoutes;
