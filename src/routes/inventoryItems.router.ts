import express, { Request, Response } from 'express';

import { InventoryItemModel } from '../schema/inventoryItem.schema';

export const inventoryItemsRouter = express.Router();

inventoryItemsRouter.get('', async (req: Request<{}, {}, {}, { characterId: string }>, res: Response) => {
  const { characterId } = req.query;

  const inventoryItems = await InventoryItemModel.find({ characterId });

  return res.status(200).json({ success: true, inventoryItems });
})