import { Router } from 'express';

import { ItemController } from '../controllers/item.controller';

export const itemsRouter = Router();
const itemController = new ItemController();

itemsRouter.get('', itemController.list);

itemsRouter.get('/:itemId', itemController.getOneById);
