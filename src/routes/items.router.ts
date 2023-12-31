import express, { Request, Response } from 'express';
import { ItemModel, ItemsEquipmentModel } from '../schema/item.schema';

export const itemsRouter = express.Router();

itemsRouter.get('', async (_req: Request, res: Response) => {

  const items = await ItemModel.find();

  return res.status(200).json({ success: true, items });
})

itemsRouter.get('/:itemId', async (req: Request<{ itemId: number }>, res: Response) => {
  const { itemId } = req.params;

  const item = await ItemModel.findOne({ itemId });
  console.log(`Found item with id: ${itemId}: `, item);

  return res.status(200).json({ success: true, item });
})