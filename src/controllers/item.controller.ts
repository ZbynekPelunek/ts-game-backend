import { Request, Response } from 'express';

import {
  Response_Item_GET_all,
  Request_Item_GET_one_params,
  Response_Item_GET_one,
} from '../../../shared/src';
import { ItemModel } from '../models/item.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class ItemController {
  async getAll(_req: Request, res: Response<Response_Item_GET_all>) {
    try {
      const items = await ItemModel.find();

      return res.status(200).json({ success: true, items });
    } catch (error) {
      errorHandler(error, _req, res);
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
        throw new CustomError(`Item with id '${itemId}' not found`, 404);
      }

      return res.status(200).json({ success: true, item });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
