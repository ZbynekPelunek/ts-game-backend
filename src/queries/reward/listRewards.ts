import { RewardService } from '../../services/rewardService';

export class ListRewardsQuery {
  constructor(private rewardService: RewardService) {}

  async execute() {
    const reward = await this.rewardService.list();

    return this.rewardService.transformResponse(reward);
  }
}
