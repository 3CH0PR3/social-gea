import authMock from './mocks/authMock.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Servicio de Autenticación para el ecosistema GEAWRC / Socialgea.
 * Arquitectura desacoplada: preparado para llamadas REST con tokens Bearer
 * y fallback automático con mock estructurado para desarrollo ágil.
 */
export const AuthService = {
  /**
   * Iniciar sesión con correo y contraseña
   */
  async login({ email, password }) {
    if (import.meta.env.VITE_USE_REAL_API === 'true') {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Credenciales inválidas');
      }
      return await response.json();
    }

    // Mock simulado con delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!email || !password) {
      throw new Error('Por favor completa todos los campos');
    }

    // Verificar si el usuario tiene activo el 2FA en su perfil o configuración
    const storedUser = JSON.parse(localStorage.getItem('gea_auth_user') || 'null');
    const user2FaSetting = localStorage.getItem(`gea_2fa_enabled_${email}`);
    const global2FaSetting = localStorage.getItem('gea_2fa_enabled');

    // Por defecto el 2FA está activo si el usuario lo activó en su perfil o en localStorage
    const is2FA = user2FaSetting !== null
      ? user2FaSetting === 'true'
      : (global2FaSetting === 'true' || storedUser?.twoFactorEnabled === true || authMock.currentUser.twoFactorEnabled === true);

    if (is2FA) {
      return {
        requires2FA: true,
        email,
        tempToken: 'temp_2fa_token_secure_981',
        message: 'Se requiere código 2FA de seguridad',
      };
    }

    return {
      user: { ...authMock.currentUser, email },
      tokens: authMock.authTokens,
      requires2FA: false,
    };
  },

  /**
   * Registro de nueva cuenta GEA
   */
  async register({ firstName, lastName, email, password, acceptTerms }) {
    if (!acceptTerms) {
      throw new Error('Debes aceptar los Términos y Condiciones');
    }

    if (import.meta.env.VITE_USE_REAL_API === 'true') {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al crear la cuenta');
      }
      return await response.json();
    }

    await new Promise((resolve) => setTimeout(resolve, 750));
    return {
      user: {
        ...authMock.currentUser,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
      },
      tokens: authMock.authTokens,
      requiresOtpVerification: true,
    };
  },

  /**
   * Solicitar recuperación de contraseña (envío de OTP)
   */
  async forgotPassword({ email }) {
    if (!email) {
      throw new Error('Ingresa un correo electrónico válido');
    }

    if (import.meta.env.VITE_USE_REAL_API === 'true') {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al solicitar recuperación');
      }
      return await response.json();
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Código de verificación enviado exitosamente',
      email,
      expiresIn: 300,
    };
  },

  /**
   * Verificar código OTP de recuperación o registro
   */
  async verifyOtp({ email, code, type = 'recovery' }) {
    if (!code || code.length < 6) {
      throw new Error('El código OTP debe ser de 6 dígitos');
    }

    if (import.meta.env.VITE_USE_REAL_API === 'true') {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, type }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Código OTP inválido o expirado');
      }
      return await response.json();
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      valid: true,
      resetToken: 'temp_reset_token_verified_742819',
    };
  },

  /**
   * Establecer nueva contraseña tras verificar OTP
   */
  async resetPassword({ email, resetToken, newPassword }) {
    if (newPassword.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    if (import.meta.env.VITE_USE_REAL_API === 'true') {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetToken, newPassword }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al restablecer la contraseña');
      }
      return await response.json();
    }

    await new Promise((resolve) => setTimeout(resolve, 700));
    return {
      success: true,
      message: 'Contraseña actualizada con éxito',
    };
  },

  /**
   * Validación de token 2FA en dos pasos
   */
  async verify2FA({ code, tempToken }) {
    if (!code || code.length < 6) {
      throw new Error('Ingresa el token de seguridad completo');
    }

    if (import.meta.env.VITE_USE_REAL_API === 'true') {
      const response = await fetch(`${API_BASE_URL}/auth/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: tempToken ? `Bearer ${tempToken}` : '',
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Token 2FA inválido');
      }
      return await response.json();
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      user: authMock.currentUser,
      tokens: authMock.authTokens,
    };
  },
};
