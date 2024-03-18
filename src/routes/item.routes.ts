import express, { Request, Response } from 'express';
import { ItemModel } from '../schema/item.schema';
import { Request_Item_GET_one_params, Response_Items_GET_all, Response_Items_GET_one } from '../../../shared/src';

export const itemsRouter = express.Router();

itemsRouter.get('', async (_req: Request, res: Response<Response_Items_GET_all>) => {

  const items = await ItemModel.find();

  return res.status(200).json({ success: true, items });
})

itemsRouter.get('/:itemId', async (req: Request<Request_Item_GET_one_params>, res: Response<Response_Items_GET_one>) => {
  const { itemId } = req.params;

  const item = await ItemModel.findOne({ itemId });
  console.log(`Found item with id: ${itemId}: `, item);
  if (!item) {
    return res.status(404).json({ success: false, error: `Item with id '${itemId}' not found` });
  }

  return res.status(200).json({ success: true, item });
})