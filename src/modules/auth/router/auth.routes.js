export const authRoutes = [
  {
    path: 'login',
    name: 'auth-login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Iniciar sesión | GEA-social' },
  },
  {
    path: 'register',
    name: 'auth-register',
    component: () => import('../views/registerView.vue'),
    meta: { title: 'Crear cuenta | GEA-social' },
  },
  {
    path: 'forgot',
    name: 'auth-forgot',
    component: () => import('../views/forgotView.vue'),
    meta: { title: 'Recuperar contraseña | GEA-social' },
  },
  {
    path: 'reset',
    name: 'auth-reset',
    component: () => import('../views/resetView.vue'),
    meta: { title: 'Restablecer contraseña | GEA-social' },
  },
  {
    path: 'verify-otp',
    name: 'auth-verify-otp',
    component: () => import('../views/VerifyOtpView.vue'),
    meta: { title: 'Verificar código OTP | GEA-social' },
  },
  {
    path: 'verify',
    name: 'auth-verify',
    component: () => import('../views/verifyView.vue'),
    meta: { title: 'Verificación de cuenta | GEA-social' },
  },
  {
    path: 'callback',
    name: 'auth-callback',
    component: () => import('../views/SocialCallbackView.vue'),
    meta: { title: 'Conectando cuenta | GEA-social' },
  },
];
