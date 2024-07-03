import { Request, Response } from 'express';

import {
  Request_Adventure_GET_all_query,
  Request_Adventure_GET_one_params,
  Response_Adventure_GET_all,
  Response_Adventure_GET_one,
  Reward,
} from '../../../shared/src';
import { AdventureModel } from '../models/adventure.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class AdventureController {
  async getAll(
    req: Request<{}, {}, {}, Request_Adventure_GET_all_query>,
    res: Response<Response_Adventure_GET_all>
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
              path: 'currencies.currencyId',
            },
            {
              path: 'items.itemId',
              localField: 'items.itemId',
              foreignField: 'itemId',
            },
          ],
        });
      if (adventureLevel) query.where({ adventureLevel });
      if (type) query.where({ type });
      if (limit) query.limit(limit);

      const adventures = await query.exec();
      // console.log('Adventures All lean response: ', adventures);

      return res.status(200).json({ success: true, adventures });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getOneById(
    req: Request<Request_Adventure_GET_one_params>,
    res: Response<Response_Adventure_GET_one>
  ) {
    try {
      const { adventureId } = req.params;

      const adventure = await AdventureModel.findById(adventureId).lean();

      //console.log('Adventure One lean response: ', adventure);

      if (!adventure) {
        throw new CustomError(
          `Adventure with id '${adventureId}' not found.`,
          404
        );
      }

      return res.status(200).json({ success: true, adventure });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
