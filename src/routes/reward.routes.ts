import express, { Request, Response } from 'express';

import { RewardModel } from '../schema/reward.schema';
import {
  Request_Reward_GET_one_params,
  Response_Reward_GET_all,
  Response_Reward_GET_one,
  Reward,
} from '../../../shared/src';

export const rewardsRouter = express.Router();

rewardsRouter.get('', async (_req, res: Response<Response_Reward_GET_all>) => {
  const rewards: Reward[] = await RewardModel.find().lean();
  //console.log('Rewards All lean response: ', rewards);

  return res.status(200).json({ success: true, rewards });
});

rewardsRouter.get(
  '/:rewardId',
  async (
    req: Request<Request_Reward_GET_one_params>,
    res: Response<Response_Reward_GET_one>
  ) => {
    const { rewardId } = req.params;

    const reward: Reward | null = await RewardModel.findById(rewardId).lean();
    //console.log('Reward One lean response: ', reward);

    if (!reward) {
      return res.status(404).json({
        success: false,
        error: `Reward with id '${rewardId}' not found.`,
      });
    }

    return res.status(200).json({ success: true, reward });
  }
);
