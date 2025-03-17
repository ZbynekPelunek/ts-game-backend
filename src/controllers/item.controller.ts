import { NextFunction, Request, Response } from 'express-serve-static-core';

import {
  ListItemsResponse,
  GetItemRequestParams,
  GetItemResponse
} from '../../../shared/src';
import { ItemModel } from '../models/item.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class ItemController {
  async list(
    _req: Request,
    res: Response<ListItemsResponse>,
    _next: NextFunction
  ) {
    try {
      const items = await ItemModel.find();

      res.status(200).json({ success: true, items });
    } catch (error) {
      errorHandler(error, _req, res, _next);
    }
  }

  async getOneById(
    req: Request<GetItemRequestParams>,
    res: Response<GetItemResponse>,
    _next: NextFunction
  ) {
    try {
      const { itemId } = req.params;

      const item = await ItemModel.findOne({ itemId });
      console.log(`Found item with id: ${itemId}: `, item);
      if (!item) {
        throw new CustomError(`Item with id '${itemId}' not found`, 404);
      }

      res.status(200).json({ success: true, item });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }
}
