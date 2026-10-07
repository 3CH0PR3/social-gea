import mockReferrals from './mocks/mockReferrals.json';

const STORAGE_KEY = 'socialgea_referrals_state';
const DEVICE_ID_KEY = 'socialgea_device_fingerprint';

// Genera un fingerprint estable para el dispositivo en localStorage si no existe
function getOrCreateDeviceFingerprint() {
  let fp = localStorage.getItem(DEVICE_ID_KEY);
  if (!fp) {
    const screenInfo = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'desktop';
    const lang = typeof navigator !== 'undefined' ? navigator.language : 'es-CO';
    const random = Math.random().toString(36).substring(2, 10);
    fp = `dev_${btoa(`${screenInfo}_${lang}_${random}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 14)}`;
    localStorage.setItem(DEVICE_ID_KEY, fp);
  }
  return fp;
}

export const ReferralsService = {
  getDeviceFingerprint() {
    return getOrCreateDeviceFingerprint();
  },

  async list() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // fallback
      }
    }
    const initial = JSON.parse(JSON.stringify(mockReferrals));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return Promise.resolve(initial);
  },

  async getReferralCode() {
    return Promise.resolve('CARLOS-ECO-77');
  },

  /**
   * Valida un registro de referido aplicando filtros anti-trampa y anti-VPN.
   * Reglas de validación:
   * 1. Teléfono móvil de Colombia único (+57 con OTP verificado).
   * 2. Device Fingerprint único: no puede registrarse desde el mismo dispositivo del invitador.
   * 3. Detección de Proxy/VPN o Datacenter IPs.
   * 4. Para acreditar los puntos finales, el referido debe verificar su teléfono y completar su primer reciclaje en una empresa aliada.
   */
  async processReferralInvite({ code, phone, name, email, city, isSimulatedVPN, isSameDevice }) {
    const currentDevice = getOrCreateDeviceFingerprint();

    // 1. Simulación o detección de VPN / Proxy
    if (isSimulatedVPN) {
      throw new Error('Detección Anti-Fraude: Conexión mediante VPN / Proxy / Centro de datos no permitida. Utiliza tu red móvil o residencial colombiana.');
    }

    // 2. Mismo dispositivo (abrir el link en el mismo teléfono para auto-referirse)
    if (isSameDevice) {
      throw new Error('Validación de Dispositivo: No es posible referirse a sí mismo desde el mismo dispositivo o navegador.');
    }

    // 3. Teléfono móvil de Colombia (+57 3XX...)
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    if (!cleanPhone.startsWith('573') && !cleanPhone.startsWith('3')) {
      throw new Error('Teléfono inválido: Debe ser una línea móvil de Colombia activa (+57 3xx xxx xxxx).');
    }

    const currentList = await this.list();
    // Validar teléfono duplicado
    const phoneExists = currentList.some(r => r.phone === cleanPhone);
    if (phoneExists) {
      throw new Error('Este número de teléfono ya ha sido registrado con una invitación previa.');
    }

    const newReferral = {
      id: `ref_${Date.now()}`,
      referrerCode: code,
      name,
      email,
      phone: cleanPhone,
      city: city || 'Bogotá D.C.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      registeredAt: new Date().toISOString(),
      status: 'verified_pending_recycle',
      statusLabel: 'Teléfono verificado · Pendiente primer reciclaje',
      pointsAwarded: 0,
      firstClassification: null,
      security: {
        phoneVerified: true,
        deviceFingerprint: `dev_${Math.random().toString(36).slice(2, 12)}`,
        networkType: 'Claro Móvil 5G',
        ipPrefix: '190.158.xxx.xxx',
        vpnDetected: false,
        riskScore: 'Bajo (0.03)'
      }
    };

    currentList.unshift(newReferral);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
    return newReferral;
  },

  async simulateFirstRecycle(referralId) {
    const currentList = await this.list();
    const item = currentList.find(r => r.id === referralId);
    if (!item) throw new Error('Referido no encontrado');

    if (item.status === 'blocked_fraud') {
      throw new Error('Este registro está bloqueado por violación de seguridad');
    }

    item.status = 'completed';
    item.statusLabel = 'Verificado & Clasificación completada';
    item.pointsAwarded = 150;
    item.firstClassification = {
      enterprise: 'Recicladora Metropolitana Bogotá',
      material: 'PET & Chatarra RAEE (15.0 kg)',
      date: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
    return item;
  }
};
