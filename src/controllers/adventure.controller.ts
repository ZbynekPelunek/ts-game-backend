import { NextFunction, Request, Response } from 'express-serve-static-core';

import {
  ListAdventuresRequestQuery,
  GetAdventureRequestParams,
  ListAdventuresResponse,
  GetAdventureResponse,
  Reward
} from '../../../shared/src';
import { AdventureModel } from '../models/adventure.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class AdventureController {
  async list(
    req: Request<{}, {}, {}, ListAdventuresRequestQuery>,
    res: Response<ListAdventuresResponse>,
    _next: NextFunction
  ) {
    try {
      const { populateReward, adventureLevel, type, limit } = req.query;

      const query = AdventureModel.find().lean();

      if (populateReward)
        query.populate<Reward>({
          path: 'rewards.rewardId',
          select: '-createdAt -updatedAt -__v',
          populate: [
            {
              path: 'currencies.currencyId'
            },
            {
              path: 'items.itemId',
              localField: 'items.itemId',
              foreignField: 'itemId'
            }
          ]
        });
      if (adventureLevel) query.where({ adventureLevel });
      if (type) query.where({ type });
      if (limit) query.limit(+limit);

      const adventures = await query.exec();
      // console.log('Adventures All lean response: ', adventures);

      res.status(200).json({ success: true, adventures });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async getOneById(
    req: Request<GetAdventureRequestParams>,
    res: Response<GetAdventureResponse>,
    _next: NextFunction
  ) {
    try {
      const { populateReward } = req.query;
      const { adventureId } = req.params;

      const query = AdventureModel.findById(adventureId).lean();

      if (populateReward === 'true')
        query.populate<Reward>({
          path: 'rewards.rewardId',
          select: '-createdAt -updatedAt -__v',
          populate: [
            {
              path: 'currencies.currencyId'
            },
            {
              path: 'items.itemId',
              localField: 'items.itemId',
              foreignField: 'itemId'
            }
          ]
        });

      const adventure = await query.exec();
      //console.log('Adventure One lean response: ', adventure);

      if (!adventure) {
        throw new CustomError(
          `Adventure with id '${adventureId}' not found.`,
          404
        );
      }

      res.status(200).json({ success: true, adventure });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }
}
