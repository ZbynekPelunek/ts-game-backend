import { Router } from 'express';

import { EnemyController } from '../../controllers/enemy.controller';
import { EnemyService } from '../../services/enemy.service';
import { ListEnemiesQuery } from '../../queries/enemy/listEnemies';
import { GetEnemyQuery } from '../../queries/enemy/getEnemy';

export const enemiesInternalRouter = Router();

const enemyService = new EnemyService();

const listEnemiesQuery = new ListEnemiesQuery(enemyService);
const getEnemyQuery = new GetEnemyQuery(enemyService);

const enemyController = new EnemyController({
  getEnemyQuery,
  listEnemiesQuery
});

enemiesInternalRouter.get('', enemyController.list.bind(enemyController));

enemiesInternalRouter.get(
  '/:enemyId',
  enemyController.getOneById.bind(enemyController)
);
