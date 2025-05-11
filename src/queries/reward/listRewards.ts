import { RewardService } from '../../services/reward.service';

export class ListRewardsQuery {
  constructor(private rewardService: RewardService) {}

  async execute() {
    const reward = await this.rewardService.list();

    return this.rewardService.transformResponse(reward);
  }
}
