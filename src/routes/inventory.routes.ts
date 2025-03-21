import { Router } from 'express';

import { InventoryController } from '../controllers/inventory.controller';
import {
  InventoryPatchActions,
  InventoryPostActions
} from '../../../shared/src';

export const inventoryRouter = Router();
const inventoryController = new InventoryController();

inventoryRouter.get('', inventoryController.list.bind(inventoryController));
inventoryRouter.get(
  '/:inventoryId',
  inventoryController.getOneById.bind(inventoryController)
);

inventoryRouter.post(
  '',
  inventoryController.addInventorySlot.bind(inventoryController)
);
inventoryRouter.post(
  `/${InventoryPostActions.NEW}`,
  inventoryController.createNewInventory.bind(inventoryController)
);
inventoryRouter.post(
  `/${InventoryPostActions.ADD_ITEM}`,
  inventoryController.addItem.bind(inventoryController)
);

inventoryRouter.patch(
  '/:inventorySlotId',
  inventoryController.updateInventorySlot.bind(inventoryController)
);
inventoryRouter.patch(
  `/:inventorySlotId/${InventoryPatchActions.SELL_ITEM}`,
  inventoryController.sellInventoryItem.bind(inventoryController)
);
