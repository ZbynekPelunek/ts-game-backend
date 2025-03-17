import { Router } from 'express';

import { RewardController } from '../controllers/rewardController';
import { RewardService } from '../services/rewardService';
import { ListRewardsQuery } from '../queries/reward/listRewards';
import { GetRewardQuery } from '../queries/reward/getReward';

export const rewardsRouter = Router();

const rewardService = new RewardService();

const listRewardsQuery = new ListRewardsQuery(rewardService);
const getRewardQuery = new GetRewardQuery(rewardService);

const rewardController = new RewardController({
  getRewardQuery,
  listRewardsQuery
});

rewardsRouter.get('', rewardController.list.bind(rewardController));

rewardsRouter.get(
  '/:rewardId',
  rewardController.getOneById.bind(rewardController)
);
