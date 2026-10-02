import EmpresasView from '../view/EmpresasView.vue';
import EmpresaDetailView from '../view/EmpresaDetailView.vue';
import EmpresaSubscribeView from '../view/EmpresaSubscribeView.vue';

export const empresaRoutes = [
  {
    path: '/empresas',
    name: 'empresas',
    component: EmpresasView,
  },
  {
    path: '/empresas/:id',
    name: 'empresa-detail',
    component: EmpresaDetailView,
  },
  {
    path: '/empresas/:id/suscribirme',
    name: 'empresa-subscribe',
    component: EmpresaSubscribeView,
  },
];
