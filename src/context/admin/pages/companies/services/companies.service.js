import mockCompanies from './mocks/mockAdminCompanies.json';

const STORAGE_KEY = 'socialgea_admin_companies';

function getStoredCompanies() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCompanies));
  return JSON.parse(JSON.stringify(mockCompanies));
}

function saveStoredCompanies(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const AdminCompaniesService = {
  async list() {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return getStoredCompanies();
  },

  async create(companyData) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const items = getStoredCompanies();
    const newCompany = {
      ...companyData,
      id: `EMP-${String(items.length + 1).padStart(3, '0')}`,
      registeredUsersCount: 0,
      tonnesProcessed: 0,
      status: 'active',
      scaleCertified: Boolean(companyData.scaleCertified),
    };
    items.unshift(newCompany);
    saveStoredCompanies(items);
    return newCompany;
  },

  async toggleCertification(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const items = getStoredCompanies();
    const index = items.findIndex((c) => c.id === id);
    if (index !== -1) {
      items[index].scaleCertified = !items[index].scaleCertified;
      if (items[index].scaleCertified && items[index].scaleId === 'BASC-PENDIENTE') {
        items[index].scaleId = `BASC-${items[index].municipality.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        items[index].status = 'active';
      }
      saveStoredCompanies(items);
      return items[index];
    }
    throw new Error('Empresa no encontrada');
  },
};
