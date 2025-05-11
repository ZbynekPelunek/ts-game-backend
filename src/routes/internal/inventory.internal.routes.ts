import { Router } from 'express';

import { InventoryController } from '../../controllers/inventory.controller';
import { InventoryPostActions } from '../../../../shared/src';

export const inventoryInternalRouter = Router();
const inventoryController = new InventoryController();

inventoryInternalRouter.post(
  `/${InventoryPostActions.NEW}`,
  inventoryController.createNewInventory.bind(inventoryController)
);
