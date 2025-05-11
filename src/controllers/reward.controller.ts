import { Request, Response } from 'express';

import {
  ListRewardsResponse,
  GetRewardRequestParams,
  GetRewardResponse
} from '../../../shared/src';
import { errorHandler } from '../middleware/errorHandler.middleware';
import { ListRewardsQuery } from '../queries/reward/listRewards';
import { GetRewardQuery } from '../queries/reward/getReward';
import { NextFunction } from 'express-serve-static-core';

export class RewardController {
  constructor(
    private readonly queries: {
      listRewardsQuery: ListRewardsQuery;
      getRewardQuery: GetRewardQuery;
    }
  ) {}

  async list(
    _req: Request,
    res: Response<ListRewardsResponse>,
    _next: NextFunction
  ) {
    try {
      const rewards = await this.queries.listRewardsQuery.execute();
      //console.log('Rewards All lean response: ', rewards);

      res.status(200).json({ success: true, rewards });
    } catch (error) {
      errorHandler(error, _req, res, _next);
    }
  }

  async getOneById(
    req: Request<GetRewardRequestParams>,
    res: Response<GetRewardResponse>,
    _next: NextFunction
  ) {
    try {
      const { rewardId } = req.params;

      const reward = await this.queries.getRewardQuery.execute({ rewardId });
      //console.log('Reward One lean response: ', reward);

      res.status(200).json({ success: true, reward });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }
}
