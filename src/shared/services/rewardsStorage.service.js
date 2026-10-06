import mockMarketplace from '@/context/social/pages/marketplace/data/mockMarketplace.json';
import { useEventBus, EVENTS } from '@/shared/composables/useEventBus';

const STORAGE_KEY = 'socialgea_marketplace_rewards';

function formatCopCurrency(val) {
  if (!val && val !== 0) return '100.000 COP';
  if (typeof val === 'string' && val.includes('COP')) return val;
  const num = typeof val === 'number' ? val : parseInt(val, 10) || 0;
  return new Intl.NumberFormat('es-CO').format(num) + ' COP';
}

function normalizeReward(item, index = 0) {
  const rawPoints = Number(item.rawPoints ?? item.pointsPrice ?? 500);
  const priceCOP = Number(item.priceCOP ?? (typeof item.price === 'string' ? parseInt(item.price.replace(/\D/g, ''), 10) : 150000)) || 150000;
  
  // Garantizar array de hasta 4 imágenes (1 principal + 3 secundarias)
  let images = Array.isArray(item.images) && item.images.length > 0 ? [...item.images] : [];
  if (images.length === 0 && item.image) {
    images.push(item.image);
  }
  const mainImage = images[0] || item.image || 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80';
  if (!images.includes(mainImage)) {
    images.unshift(mainImage);
  }

  const supplier = item.partnerEnterprise || item.supplier || 'Recicladora Metropolitana Bogotá';

  return {
    id: item.id || `rew_${Date.now()}_${index}`,
    title: item.title || 'Producto Patrocinado Socialgea',
    description: item.description || 'Producto recuperado y patrocinado mediante la recolección y reciclaje en Socialgea Colombia.',
    category: item.category || 'Electrodomésticos',
    rawPoints,
    pointsPrice: `${new Intl.NumberFormat('es-CO').format(rawPoints)} Pts`,
    priceCOP,
    price: formatCopCurrency(priceCOP),
    recyclingEquivalent: item.recyclingEquivalent || `Equivale a ${Math.round(rawPoints / 20)} kg de PET clasificado`,
    partnerEnterprise: supplier,
    supplier,
    deliveryInfo: item.deliveryInfo || 'Retiro gratuito en sedes aliadas o despacho nacional a domicilio',
    location: item.location || 'Envío nacional o retiro en centro de acopio',
    stock: item.stock !== undefined ? Number(item.stock) : 15,
    status: item.status || 'active',
    specs: Array.isArray(item.specs) && item.specs.length > 0 ? item.specs : [
      'Garantía oficial directa con la empresa patrocinadora',
      'Eficiencia de bajo consumo eléctrico para el hogar',
      'Certificado de trazabilidad de reciclaje circular'
    ],
    image: mainImage,
    images: images.slice(0, 4),
    createdAt: item.createdAt || new Date().toISOString().split('T')[0],
    totalRedeemed: item.totalRedeemed || 0,
  };
}

function loadInitialRewards() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => normalizeReward(item, idx));
      }
    } catch {
      // fallback
    }
  }

  // Carga inicial desde mockMarketplace
  const initial = (mockMarketplace || []).map((item, idx) => normalizeReward(item, idx));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export const RewardsStorageService = {
  list() {
    return loadInitialRewards();
  },

  create(data) {
    const items = loadInitialRewards();
    const newId = `rew_${Date.now()}`;
    const normalized = normalizeReward({
      ...data,
      id: newId,
      totalRedeemed: 0,
      createdAt: new Date().toISOString().split('T')[0],
    });

    items.unshift(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    // Notificar en tiempo real a cualquier vista/store suscrito
    const eventBus = useEventBus();
    eventBus.emit(EVENTS.REWARDS_SYNCED, { action: 'create', reward: normalized, items });

    return normalized;
  },

  update(id, data) {
    const items = loadInitialRewards();
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Producto ${id} no encontrado`);
    }

    const updated = normalizeReward({
      ...items[index],
      ...data,
      id,
    });

    items[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    const eventBus = useEventBus();
    eventBus.emit(EVENTS.REWARDS_SYNCED, { action: 'update', reward: updated, items });

    return updated;
  },

  delete(id) {
    const items = loadInitialRewards();
    const filtered = items.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    const eventBus = useEventBus();
    eventBus.emit(EVENTS.REWARDS_SYNCED, { action: 'delete', id, items: filtered });

    return { success: true, id };
  },
};
