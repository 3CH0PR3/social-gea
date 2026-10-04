export default [
  {
    path: 'empresas',
    name: 'social.companies',
    component: () => import('../view/EmpresasView.vue'),
    meta: { title: 'Empresas de Reciclaje' },
  },
  {
    path: 'companies',
    name: 'social.companies.alt',
    component: () => import('../view/EmpresasView.vue'),
    meta: { title: 'Empresas de Reciclaje' },
  },
  {
    path: 'empresas/:id',
    name: 'social.companies.detail',
    component: () => import('../view/EmpresaDetailView.vue'),
    meta: { title: 'Detalle de Empresa' },
  },
  {
    path: 'empresas/:id/suscribirme',
    name: 'social.companies.subscribe',
    component: () => import('../view/EmpresaSubscribeView.vue'),
    meta: { title: 'Afiliación' },
  },
];
