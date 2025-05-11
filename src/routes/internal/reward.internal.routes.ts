import { Router } from 'express';

import { RewardController } from '../../controllers/reward.controller';
import { RewardService } from '../../services/reward.service';
import { ListRewardsQuery } from '../../queries/reward/listRewards';
import { GetRewardQuery } from '../../queries/reward/getReward';

export const rewardsInternalRouter = Router();

const rewardService = new RewardService();

const listRewardsQuery = new ListRewardsQuery(rewardService);
const getRewardQuery = new GetRewardQuery(rewardService);

const rewardController = new RewardController({
  getRewardQuery,
  listRewardsQuery
});

rewardsInternalRouter.get('', rewardController.list.bind(rewardController));

rewardsInternalRouter.get(
  '/:rewardId',
  rewardController.getOneById.bind(rewardController)
);
