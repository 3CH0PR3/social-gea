export const historyRoutes = [
  {
    path: '/historys',
    name: 'historys',
    component: () => import('../view/HistoryView.vue'),
    meta: { mobileFullSheet: true },
  },
];

export default historyRoutes;
