import { defineStore } from 'pinia';
import { MOCK_MARKETPLACE_ITEMS } from '../data/mockMarketplace';

export const useMarketplaceStore = defineStore('marketplace', {
  state: () => ({
    items: [...MOCK_MARKETPLACE_ITEMS],
    searchQuery: '',
    selectedCategory: '',
    selectedPointsRange: '',
    selectedDeliveryMethod: '',
    // User Points Balance accumulated by classifying recycling
    userPoints: 1250,
    // History of materials classified by user in affiliated enterprises
    userClassifications: [
      {
        id: 'cl_1',
        material: 'PET Transparente (Botellas)',
        amount: '18.5 kg',
        pointsEarned: 370,
        enterprise: 'Recicladora Metropolitana Bogotá',
        date: 'Hace 2 días'
      },
      {
        id: 'cl_2',
        material: 'Cartón & Papel Archivo',
        amount: '24.0 kg',
        pointsEarned: 240,
        enterprise: 'Recicladora Metropolitana Bogotá',
        date: 'Hace 5 días'
      },
      {
        id: 'cl_3',
        material: 'Chatarra Electrónica RAEE',
        amount: '11.0 kg',
        pointsEarned: 640,
        enterprise: 'TechCycle Colombia',
        date: 'Hace 1 semana'
      }
    ],
    // Redeemed Rewards history
    redeemedRewards: [
      {
        id: 'red_demo',
        itemTitle: 'Botella Térmica de Acero Inoxidable 750ml',
        pointsSpent: 290,
        ticketCode: 'ECO-COL-94821',
        date: 'Ayer a las 16:30',
        status: 'Listo para retiro',
        deliveryMethod: 'Retiro en centro de reciclaje',
        enterprise: 'Recicladora Metropolitana Bogotá'
      }
    ],
    // Modal state for reward redemption process
    activeRedeemItem: null,
    isRedeemModalOpen: false,
  }),

  getters: {
    categoriesList(state) {
      const set = new Set(state.items.map((i) => i.category));
      return Array.from(set);
    },

    hasActiveFilters(state) {
      return Boolean(
        state.searchQuery.trim() ||
        state.selectedCategory ||
        state.selectedPointsRange ||
        state.selectedDeliveryMethod
      );
    },

    filteredItems(state) {
      return state.items.filter((item) => {
        // Search query
        if (state.searchQuery.trim()) {
          const q = state.searchQuery.toLowerCase();
          const match =
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            (item.partnerEnterprise && item.partnerEnterprise.toLowerCase().includes(q)) ||
            (item.recyclingEquivalent && item.recyclingEquivalent.toLowerCase().includes(q));
          if (!match) return false;
        }

        // Category filter
        if (state.selectedCategory && item.category !== state.selectedCategory) {
          return false;
        }

        // Points Range filter
        if (state.selectedPointsRange) {
          const pts = item.rawPoints || 0;
          if (state.selectedPointsRange === 'low' && pts > 500) return false;
          if (state.selectedPointsRange === 'mid' && (pts <= 500 || pts > 1000)) return false;
          if (state.selectedPointsRange === 'high' && pts <= 1000) return false;
        }

        // Can afford filter
        if (state.selectedPointsRange === 'affordable' && item.rawPoints > state.userPoints) {
          return false;
        }

        return true;
      });
    },
  },

  actions: {
    setSearch(query) {
      this.searchQuery = query;
    },
    setCategory(category) {
      this.selectedCategory = category;
    },
    setPointsRange(range) {
      this.selectedPointsRange = range;
    },
    setDeliveryMethod(method) {
      this.selectedDeliveryMethod = method;
    },
    resetFilters() {
      this.searchQuery = '';
      this.selectedCategory = '';
      this.selectedPointsRange = '';
      this.selectedDeliveryMethod = '';
    },

    openRedeemModal(item) {
      this.activeRedeemItem = item;
      this.isRedeemModalOpen = true;
    },

    closeRedeemModal() {
      this.activeRedeemItem = null;
      this.isRedeemModalOpen = false;
    },

    confirmRedemption(item, deliveryData) {
      if (this.userPoints < item.rawPoints) {
        return { success: false, message: 'No tienes suficientes puntos para este canje.' };
      }

      this.userPoints -= item.rawPoints;
      const ticketCode = `CANJE-${Math.floor(100000 + Math.random() * 900000)}`;

      const newRedemption = {
        id: `red_${Date.now()}`,
        itemTitle: item.title,
        pointsSpent: item.rawPoints,
        ticketCode,
        date: 'Reciente',
        status: 'En preparación',
        deliveryMethod: deliveryData.method || 'Retiro en punto de reciclaje',
        recipientName: deliveryData.recipientName || 'Usuario Socialgea',
        address: deliveryData.address || 'Punto aliado',
        enterprise: item.partnerEnterprise || 'Empresa Recicladora Aliada'
      };

      this.redeemedRewards.unshift(newRedemption);
      return { success: true, ticketCode, redemption: newRedemption };
    }
  },
});
