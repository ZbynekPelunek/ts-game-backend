import { Router } from 'express';

import { ItemController } from '../../controllers/item.controller';

export const itemsInternalRouter = Router();
const itemController = new ItemController();

itemsInternalRouter.get('', itemController.list);

itemsInternalRouter.get('/:itemId', itemController.getOneById);
