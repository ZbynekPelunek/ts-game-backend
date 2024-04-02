import express, { Request, Response } from 'express';

import { EnemyModel } from '../schema/enemy.schema';
import {
  Request_Enemy_GET_one_params,
  Response_Enemy_GET_all,
  Response_Enemy_GET_one,
} from '../../../shared/src';

export const enemiesRouter = express.Router();

enemiesRouter.get('', async (_req, res: Response<Response_Enemy_GET_all>) => {
  const enemies = await EnemyModel.find().lean();
  //console.log('Enemies All lean response: ', enemies);

  return res.status(200).json({ success: true, enemies });
});

enemiesRouter.get(
  '/:enemyId',
  async (
    req: Request<Request_Enemy_GET_one_params>,
    res: Response<Response_Enemy_GET_one>
  ) => {
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
  }
);
