export const adminRoutes = [
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../pages/auth/view/AdminLoginView.vue'),
    meta: { title: 'Acceso Consola Administrativa · Socialgea' },
  },
  {
    path: '/admin',
    component: () => import('../layout/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../pages/dashboard/view/AdminDashboardView.vue'),
        meta: { title: 'Dashboard & Analíticas · Socialgea Admin' },
      },
      {
        path: 'rewards',
        name: 'admin-rewards',
        component: () => import('../pages/rewards/view/AdminRewardsView.vue'),
        meta: { title: 'Gestión de Catálogo de Premios · Socialgea Admin' },
      },
      {
        path: 'moderation',
        name: 'admin-moderation',
        component: () => import('../pages/moderation/view/AdminModerationView.vue'),
        meta: { title: 'Cola de Moderación · Socialgea Admin' },
      },
      {
        path: 'companies',
        name: 'admin-companies',
        component: () => import('../pages/companies/view/AdminCompaniesView.vue'),
        meta: { title: 'Empresas & Básculas · Socialgea Admin' },
      },
      {
        path: 'redemptions',
        name: 'admin-redemptions',
        component: () => import('../pages/redemptions/view/AdminRedemptionsView.vue'),
        meta: { title: 'Canjes & Vouchers · Socialgea Admin' },
      },
    ],
  },
];
