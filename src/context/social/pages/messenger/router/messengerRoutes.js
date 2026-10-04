export const messengerRoutes = [
  {
    path: '/messenger',
    name: 'messenger',
    component: () => import('../view/MessengerView.vue'),
  },
];

export default messengerRoutes;
