import { RewardsStorageService } from '@/shared/services/rewardsStorage.service';

export const AdminRewardsService = {
  async list() {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return RewardsStorageService.list();
  },

  async create(rewardData) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return RewardsStorageService.create(rewardData);
  },

  async update(id, rewardData) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return RewardsStorageService.update(id, rewardData);
  },

  async delete(id) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return RewardsStorageService.delete(id);
  },
};
