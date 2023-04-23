import express, { Request, Response } from 'express';

import { InventoryItemModel } from '../schema/inventoryItem.schema';

export const inventoryItemsRouter = express.Router();

inventoryItemsRouter.get('', async (req: Request<{}, {}, {}, { characterId: string }>, res: Response) => {
  const { characterId } = req.query;

  const inventoryItems = await InventoryItemModel.find({ characterId });

  return res.status(200).json({ success: true, inventoryItems });
})

// inventoriesRouter.post('', async (req: Request<{}, {}, Request_Inventories_POST_body>, res: Response<Response_Inventories_POST>) => {
//   const { characterId } = req.body;

//   const inventory = new InventoryModel();
//   inventory.characterId = characterId;

//   await inventory.save();

//   return res.status(201).json({ success: true, inventory: { inventoryId: inventory._id.toString() } });
// });