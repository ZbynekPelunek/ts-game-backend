import { Request, Response } from 'express';

import {
  Response_Item_GET_all,
  Request_Item_GET_one_params,
  Response_Item_GET_one,
} from '../../../shared/src';
import { ItemModel } from '../models/item.model';

export class ItemController {
  async getAll(_req: Request, res: Response<Response_Item_GET_all>) {
    try {
      const items = await ItemModel.find();

      return res.status(200).json({ success: true, items });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Item Get All Error [TBI]' });
    }
  }

  async getOneById(
    req: Request<Request_Item_GET_one_params>,
    res: Response<Response_Item_GET_one>
  ) {
    try {
      const { itemId } = req.params;

      const item = await ItemModel.findOne({ itemId });
      console.log(`Found item with id: ${itemId}: `, item);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: `Item with id '${itemId}' not found`,
        });
      }

      return res.status(200).json({ success: true, item });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Item Get One Error [TBI]' });
    }
  }
}
