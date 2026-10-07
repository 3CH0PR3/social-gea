export const referralRoutes = [
  {
    path: 'referrals',
    name: 'social.referrals',
    component: () => import('../view/ReferralsView.vue'),
    meta: {
      title: 'Referidos & EcoPuntos',
    },
  },
];

export default referralRoutes;
