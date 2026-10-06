import { ref, computed } from 'vue';

const ADMIN_STORAGE_KEY = 'socialgea_admin_session';

export const ADMIN_ROLES_CONFIG = {
  super_admin: {
    role: 'super_admin',
    label: 'Super Administrador',
    description: 'Acceso total a métricas, catálogo de premios, moderación y básculas.',
    modules: ['dashboard', 'rewards', 'moderation', 'companies', 'redemptions'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    email: 'admin.carlos@socialgea.co',
    name: 'Carlos Méndez',
  },
  moderator: {
    role: 'moderator',
    label: 'Moderador de Comunidad',
    description: 'Enfocado en cola de moderación, seguridad comunitaria y sanción de reportes.',
    modules: ['moderation'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    email: 'moderacion.laura@socialgea.co',
    name: 'Laura Restrepo',
  },
  company_manager: {
    role: 'company_manager',
    label: 'Gestor de Empresas & Básculas',
    description: 'Administración de centros de acopio, entrega de premios patrocinados y vouchers.',
    modules: ['rewards', 'companies', 'redemptions'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    email: 'aliados.felipe@socialgea.co',
    name: 'Felipe Gómez (Recicladora)',
  },
};

function getStoredAdmin() {
  const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.role && ADMIN_ROLES_CONFIG[parsed.role]) {
        return {
          ...ADMIN_ROLES_CONFIG[parsed.role],
          ...parsed,
        };
      }
    } catch {
      // fallback
    }
  }
  const defaultSession = { ...ADMIN_ROLES_CONFIG.super_admin };
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(defaultSession));
  return defaultSession;
}

// Singleton compartido por toda la app para reactividad inmediata
const adminUserState = ref(getStoredAdmin());
const authError = ref(null);
const isAuthLoading = ref(false);

export function useAdminAuth() {
  const adminUser = computed(() => adminUserState.value);

  const isAuthenticated = computed(() => Boolean(adminUserState.value));
  const activeRole = computed(() => adminUserState.value?.role || 'super_admin');

  const isSuperAdmin = computed(() => activeRole.value === 'super_admin');
  const isModerator = computed(() => activeRole.value === 'moderator');
  const isCompanyManager = computed(() => activeRole.value === 'company_manager');

  function canAccess(moduleName) {
    if (!adminUserState.value) return false;
    if (adminUserState.value.role === 'super_admin') return true;
    const allowed = ADMIN_ROLES_CONFIG[adminUserState.value.role]?.modules || [];
    return allowed.includes(moduleName);
  }

  const canViewDashboard = computed(() => canAccess('dashboard'));
  const canViewRewards = computed(() => canAccess('rewards'));
  const canViewModeration = computed(() => canAccess('moderation'));
  const canViewCompanies = computed(() => canAccess('companies'));
  const canViewRedemptions = computed(() => canAccess('redemptions'));

  async function login(email, password, roleChoice = 'super_admin') {
    isAuthLoading.value = true;
    authError.value = null;
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (!email || !password) {
      authError.value = 'Por favor ingresa correo y contraseña.';
      isAuthLoading.value = false;
      return false;
    }

    const baseConfig = ADMIN_ROLES_CONFIG[roleChoice] || ADMIN_ROLES_CONFIG.super_admin;
    const session = {
      ...baseConfig,
      email,
    };

    adminUserState.value = session;
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
    isAuthLoading.value = false;
    return true;
  }

  function logout() {
    adminUserState.value = null;
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }

  function switchRole(newRole) {
    const baseConfig = ADMIN_ROLES_CONFIG[newRole] || ADMIN_ROLES_CONFIG.super_admin;
    const updated = {
      ...baseConfig,
    };
    adminUserState.value = updated;
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
  }

  return {
    adminUser,
    activeRole,
    isAuthenticated,
    isSuperAdmin,
    isModerator,
    isCompanyManager,
    canAccess,
    canViewDashboard,
    canViewRewards,
    canViewModeration,
    canViewCompanies,
    canViewRedemptions,
    isLoading: isAuthLoading,
    error: authError,
    login,
    logout,
    switchRole,
    ADMIN_ROLES_CONFIG,
  };
}
