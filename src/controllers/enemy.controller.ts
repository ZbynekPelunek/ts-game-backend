import { NextFunction, Request, Response } from 'express';

import {
  GetEnemyRequestParams,
  GetEnemyResponse,
  ListEnemiesResponse
} from '../../../shared/src';
import { errorHandler } from '../middleware/errorHandler.middleware';
import { ListEnemiesQuery } from '../queries/enemy/listEnemies';
import { GetEnemyQuery } from '../queries/enemy/getEnemy';

export class EnemyController {
  constructor(
    private readonly queries: {
      listEnemiesQuery: ListEnemiesQuery;
      getEnemyQuery: GetEnemyQuery;
    }
  ) {}

  async list(
    _req: Request,
    res: Response<ListEnemiesResponse>,
    _next: NextFunction
  ) {
    try {
      const enemies = await this.queries.listEnemiesQuery.execute();

      res.status(200).json({ success: true, enemies });
    } catch (error) {
      errorHandler(error, _req, res, _next);
    }
  }

  async getOneById(
    req: Request<GetEnemyRequestParams>,
    res: Response<GetEnemyResponse>,
    _next: NextFunction
  ) {
    try {
      const { enemyId } = req.params;

      const enemy = await this.queries.getEnemyQuery.execute({ enemyId });

      res.status(200).json({ success: true, enemy });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }
}
