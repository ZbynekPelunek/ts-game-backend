import { Router } from 'express';

import { RewardController } from '../controllers/reward.controller';

export const rewardsRouter = Router();
const rewardController = new RewardController();

rewardsRouter.get('', rewardController.getAll);

rewardsRouter.get('/:rewardId', rewardController.getOneById);
