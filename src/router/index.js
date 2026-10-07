import { createRouter, createWebHashHistory } from 'vue-router';
import SocialLayout from '@/layouts/SocialLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { feedRoutes } from '@/context/social/pages/feed/router/feedRoutes';
import { historyRoutes } from '@/context/social/pages/historys/router/historyRoutes';
import { profileRoutes } from '@/context/social/pages/profiles/router/profileRoutes';
import { radarRoutes } from '@/context/social/pages/radar/router/radarRoutes';
import { notificationRoutes } from '@/context/social/pages/notifications/router/notificationRoutes';
import { messengerRoutes } from '@/context/social/pages/messenger/router/messengerRoutes';
import { empresaRoutes } from '@/context/social/pages/empresas/router/empresaRoutes';
import { marketplaceRoutes } from '@/context/social/pages/marketplace/router/marketplaceRoutes';
import { referralRoutes } from '@/context/social/pages/referrals/router/referralRoutes';
import { authRoutes } from '@/context/social/auth/router/auth.routes';
import { landingRoutes } from '@/context/social/pages/landing/router/landingRoutes';
import { adminRoutes } from '@/context/admin/router/admin.routes';

const routes = [
  ...landingRoutes,
  ...adminRoutes,
  {
    path: '/auth',
    component: AuthLayout,
    redirect: '/auth/login',
    children: [
      ...authRoutes,
    ],
  },
  {
    path: '/login',
    redirect: '/auth/login',
  },
  {
    path: '/register',
    redirect: '/auth/register',
  },
  {
    path: '/',
    component: SocialLayout,
    children: [
      ...feedRoutes,
      ...historyRoutes,
      ...profileRoutes,
      ...radarRoutes,
      ...notificationRoutes,
      ...messengerRoutes,
      ...empresaRoutes,
      ...marketplaceRoutes,
      ...referralRoutes,
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/feeds',
  },
];

let previousNonProfileRoute = '/feeds';
let profileHistoryStack = [];

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

router.afterEach((to, from) => {
  if (from && from.path && !from.path.startsWith('/profiles')) {
    previousNonProfileRoute = from.fullPath || from.path;
    profileHistoryStack = [];
  }

  if (to && to.path && to.path.startsWith('/profiles')) {
    if (profileHistoryStack[profileHistoryStack.length - 1] !== to.fullPath) {
      profileHistoryStack.push(to.fullPath);
    }
  }
});

export function getPreviousNonProfileRoute() {
  return previousNonProfileRoute || '/feeds';
}

export function popProfileRoute() {
  if (profileHistoryStack.length > 1) {
    profileHistoryStack.pop(); // remove active profile
    return profileHistoryStack.pop() || previousNonProfileRoute || '/feeds';
  }
  profileHistoryStack = [];
  return previousNonProfileRoute || '/feeds';
}

export default router;
