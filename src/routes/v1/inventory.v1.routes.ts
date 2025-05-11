import { Router } from 'express';

import { InventoryController } from '../../controllers/inventory.controller';
import {
  InventoryPatchActions,
  InventoryPostActions
} from '../../../../shared/src';
import { authenticateJWT } from '../../middleware/auth.middleware';

export const inventoryV1Router = Router();
const inventoryController = new InventoryController();

inventoryV1Router.get(
  '',
  authenticateJWT,
  inventoryController.list.bind(inventoryController)
);
inventoryV1Router.get(
  '/:inventoryId',
  authenticateJWT,
  inventoryController.getOneById.bind(inventoryController)
);

inventoryV1Router.post(
  '',
  authenticateJWT,
  inventoryController.addInventorySlot.bind(inventoryController)
);
inventoryV1Router.post(
  `/${InventoryPostActions.ADD_ITEM}`,
  authenticateJWT,
  inventoryController.addItem.bind(inventoryController)
);

inventoryV1Router.patch(
  '/:inventorySlotId',
  authenticateJWT,
  inventoryController.updateInventorySlot.bind(inventoryController)
);
inventoryV1Router.patch(
  `/:inventorySlotId/${InventoryPatchActions.SELL_ITEM}`,
  authenticateJWT,
  inventoryController.sellInventoryItem.bind(inventoryController)
);
