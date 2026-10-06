export const landingRoutes = [
  {
    path: '/landing',
    name: 'landing',
    component: () => import('../view/LandingView.vue'),
    meta: {
      title: 'Socialgea Colombia · Recicla, Acumula Puntos y Canjea Premios',
    },
  },
];

export default landingRoutes;
