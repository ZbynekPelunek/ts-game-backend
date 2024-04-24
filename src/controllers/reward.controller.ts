import { Request, Response } from 'express';

import {
  Response_Reward_GET_all,
  Reward,
  Request_Reward_GET_one_params,
  Response_Reward_GET_one,
} from '../../../shared/src';
import { RewardModel } from '../models/reward.model';

export class RewardController {
  async getAll(_req: Request, res: Response<Response_Reward_GET_all>) {
    try {
      const rewards: Reward[] = await RewardModel.find().lean();
      //console.log('Rewards All lean response: ', rewards);

      return res.status(200).json({ success: true, rewards });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Reward Get All Error [TBI]' });
    }
  }

  async getOneById(
    req: Request<Request_Reward_GET_one_params>,
    res: Response<Response_Reward_GET_one>
  ) {
    try {
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
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Reward Get One Error [TBI]' });
    }
  }
}
