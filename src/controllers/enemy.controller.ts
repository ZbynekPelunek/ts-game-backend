import { Request, Response } from 'express';

import {
  Response_Enemy_GET_all,
  Request_Enemy_GET_one_params,
  Response_Enemy_GET_one,
} from '../../../shared/src';
import { EnemyModel } from '../models/enemy.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class EnemyController {
  async getAll(_req: Request, res: Response<Response_Enemy_GET_all>) {
    try {
      const enemies = await EnemyModel.find().lean();
      //console.log('Enemies All lean response: ', enemies);

      return res.status(200).json({ success: true, enemies });
    } catch (error) {
      errorHandler(error, _req, res);
    }
  }

  async getOneById(
    req: Request<Request_Enemy_GET_one_params>,
    res: Response<Response_Enemy_GET_one>
  ) {
    try {
      const { enemyId } = req.params;

      const enemy = await EnemyModel.findById(enemyId).lean();
      //console.log('Enemy One lean response: ', enemy);

      if (!enemy) {
        throw new CustomError(`Enemy with id '${enemyId}' not found.`, 404);
      }

      return res.status(200).json({ success: true, enemy });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
