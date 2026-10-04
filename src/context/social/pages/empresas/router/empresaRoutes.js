export const empresaRoutes = [
  {
    path: '/empresas',
    name: 'empresas',
    component: () => import('../view/EmpresasView.vue'),
  },
  {
    path: '/empresas/:id',
    name: 'empresa-detail',
    component: () => import('../view/EmpresaDetailView.vue'),
  },
  {
    path: '/empresas/:id/suscribirme',
    name: 'empresa-subscribe',
    component: () => import('../view/EmpresaSubscribeView.vue'),
  },
];

export default empresaRoutes;
