import express, { Request, Response } from 'express';
import { Types } from 'mongoose';

import { Response_Inventory_POST } from '../../../shared/src';
import { InventoryModel } from '../schema/inventory.schema';


export const inventoriesRouter = express.Router();

inventoriesRouter.get('/:inventoryId', async (req: Request<{ inventoryId: string }>, res: Response) => {
  const { inventoryId } = req.params;

  const inventory = await InventoryModel.findById(inventoryId).exec();
  const responseInventory = {
    inventoryId: inventory?._id.toString(),
    slots: inventory?.slots
  }

  return res.status(200).json({ succes: true, inventory: responseInventory });
})

inventoriesRouter.post('', async (req: Request<{}, {}, { characterId: Types.ObjectId; }>, res: Response<Response_Inventory_POST>) => {
  const { characterId } = req.body;

  const inventory = new InventoryModel();
  inventory.characterId = characterId;

  await inventory.save();

  return res.status(201).json({ succes: true, inventory: { inventoryId: inventory._id } });
});