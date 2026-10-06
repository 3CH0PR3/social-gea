import mockReports from './mocks/mockAdminReports.json';

const STORAGE_KEY = 'socialgea_admin_reports';

function getStoredReports() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockReports));
  return JSON.parse(JSON.stringify(mockReports));
}

function saveStoredReports(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const AdminModerationService = {
  async list() {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return getStoredReports();
  },

  async applyAction(reportId, actionType, notes) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const items = getStoredReports();
    const index = items.findIndex((r) => r.id === reportId);
    if (index === -1) {
      throw new Error(`Reporte ${reportId} no encontrado`);
    }

    const updated = {
      ...items[index],
      status: actionType === 'dismiss' ? 'resolved_dismissed' : 'resolved_action_taken',
      resolution: {
        action: actionType, // dismiss, hide_content, warn_user, suspend_24h, suspend_7d, ban_permanent
        resolvedBy: 'Admin Principal',
        resolvedAt: new Date().toISOString(),
        notes: notes || 'Acción ejecutada desde la consola de moderación',
      },
    };

    items[index] = updated;
    saveStoredReports(items);
    return updated;
  },
};
