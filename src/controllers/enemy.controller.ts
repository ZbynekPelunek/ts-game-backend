import { Request, Response } from 'express';

import {
  Response_Enemy_GET_all,
  Request_Enemy_GET_one_params,
  Response_Enemy_GET_one,
} from '../../../shared/src';
import { EnemyModel } from '../models/enemy.model';

export class EnemyController {
  async getAll(_req: Request, res: Response<Response_Enemy_GET_all>) {
    try {
      const enemies = await EnemyModel.find().lean();
      //console.log('Enemies All lean response: ', enemies);

      return res.status(200).json({ success: true, enemies });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Enemy Get All Error [TBI]' });
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
        return res.status(404).json({
          success: false,
          error: `Enemy with id '${enemyId}' not found.`,
        });
      }

      return res.status(200).json({ success: true, enemy });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Enemy Get One Error [TBI]' });
    }
  }
}
