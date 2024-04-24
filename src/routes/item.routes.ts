import { Router } from 'express';

import { ItemController } from '../controllers/item.controller';

export const itemsRouter = Router();
const itemController = new ItemController();

itemsRouter.get('', itemController.getAll);

itemsRouter.get('/:itemId', itemController.getOneById);
