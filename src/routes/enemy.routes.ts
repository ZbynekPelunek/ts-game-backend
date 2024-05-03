import { Router } from 'express';

import { EnemyController } from '../controllers/enemy.controller';

export const enemiesRouter = Router();
const enemyController = new EnemyController();

enemiesRouter.get('', enemyController.getAll);

enemiesRouter.get('/:enemyId', enemyController.getOneById);
