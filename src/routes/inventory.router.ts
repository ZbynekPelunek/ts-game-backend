import express, { Request, Response } from 'express';

import { Response_Inventory_POST } from '../../../shared/src';
import { InventoryModel } from '../schema/inventory.schema';


export const inventoriesRouter = express.Router();

inventoriesRouter.post('', async (_req: Request, res: Response<Response_Inventory_POST>) => {
  const inventory = new InventoryModel();
  await inventory.save();

  return res.status(201).json({ succes: true, inventory: { inventoryId: inventory._id } });
});