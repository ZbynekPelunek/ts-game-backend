import { Router } from 'express';

import { EnemyController } from '../controllers/enemyController';
import { EnemyService } from '../services/enemyService';
import { ListEnemiesQuery } from '../queries/enemy/listEnemies';
import { GetEnemyQuery } from '../queries/enemy/getEnemy';

export const enemiesRouter = Router();

const enemyService = new EnemyService();

const listEnemiesQuery = new ListEnemiesQuery(enemyService);
const getEnemyQuery = new GetEnemyQuery(enemyService);

const enemyController = new EnemyController({
  getEnemyQuery,
  listEnemiesQuery
});

enemiesRouter.get('', enemyController.list.bind(enemyController));

enemiesRouter.get(
  '/:enemyId',
  enemyController.getOneById.bind(enemyController)
);
