import { GetRewardRequestParams } from '../../../../shared/src';
import { RewardService } from '../../services/rewardService';

export class GetRewardQuery {
  constructor(private rewardService: RewardService) {}

  async execute(params: GetRewardRequestParams) {
    const reward = await this.rewardService.getById(params);

    return this.rewardService.transformResponse(reward);
  }
}
