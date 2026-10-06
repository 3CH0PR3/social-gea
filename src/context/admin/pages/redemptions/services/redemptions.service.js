import mockRedemptions from './mocks/mockAdminRedemptions.json';

const STORAGE_KEY = 'socialgea_admin_redemptions';

function getStoredRedemptions() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRedemptions));
  return JSON.parse(JSON.stringify(mockRedemptions));
}

function saveStoredRedemptions(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const AdminRedemptionsService = {
  async list() {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return getStoredRedemptions();
  },

  async updateStatus(voucherCode, newStatus, carrierGuide) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const items = getStoredRedemptions();
    const index = items.findIndex((r) => r.voucherCode === voucherCode);
    if (index !== -1) {
      items[index].status = newStatus;
      if (carrierGuide) {
        items[index].carrierGuide = carrierGuide;
      }
      saveStoredRedemptions(items);
      return items[index];
    }
    throw new Error('Comprobante no encontrado');
  },
};
