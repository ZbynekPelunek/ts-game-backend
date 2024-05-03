import { Request, Response } from 'express';

import {
  Response_Reward_GET_all,
  Reward,
  Request_Reward_GET_one_params,
  Response_Reward_GET_one,
} from '../../../shared/src';
import { RewardModel } from '../models/reward.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class RewardController {
  async getAll(_req: Request, res: Response<Response_Reward_GET_all>) {
    try {
      const rewards: Reward[] = await RewardModel.find().lean();
      //console.log('Rewards All lean response: ', rewards);

      return res.status(200).json({ success: true, rewards });
    } catch (error) {
      errorHandler(error, _req, res);
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
        throw new CustomError(`Reward with id '${rewardId}' not found.`, 404);
      }

      return res.status(200).json({ success: true, reward });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
