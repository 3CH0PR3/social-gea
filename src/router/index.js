import { createRouter, createWebHashHistory } from 'vue-router';
import { feedRoutes } from '@/modules/feeds/router/feedRoutes';
import { historyRoutes } from '@/modules/historys/router/historyRoutes';
import { profileRoutes } from '@/modules/profiles/router/profileRoutes';
import { radarRoutes } from '@/modules/radar/router/radarRoutes';
import { notificationRoutes } from '@/modules/notifications/router/notificationRoutes';
import { messengerRoutes } from '@/modules/messenger/router/messengerRoutes';
import { empresaRoutes } from '@/modules/empresas/router/empresaRoutes';
import { marketplaceRoutes } from '@/modules/marketplace/router/marketplaceRoutes';

const routes = [
  ...feedRoutes,
  ...historyRoutes,
  ...profileRoutes,
  ...radarRoutes,
  ...notificationRoutes,
  ...messengerRoutes,
  ...empresaRoutes,
  ...marketplaceRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/feeds',
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    // Do not scroll to top if only query or hash changes on the same page
    if (to.path === from.path) {
      return false;
    }
    return { top: 0, behavior: 'smooth' };
  },
});

export default router;
