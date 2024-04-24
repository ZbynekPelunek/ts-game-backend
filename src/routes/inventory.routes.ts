import { Router } from 'express';

import { InventoryController } from '../controllers/inventory.controller';

export const inventoryRouter = Router();
const inventoryController = new InventoryController();

inventoryRouter.get('', inventoryController.getAll.bind(inventoryController));

inventoryRouter.get(
  '/:inventoryId',
  inventoryController.getOneById.bind(inventoryController)
);

inventoryRouter.post('', inventoryController.post.bind(inventoryController));

inventoryRouter.patch(
  '/:inventoryId',
  inventoryController.patch.bind(inventoryController)
);
