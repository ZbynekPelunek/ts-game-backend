import { CustomError } from '../middleware/errorHandler';
import { ItemsEquipmentModel } from '../models/item.model';

export class ItemService {
  async getById(params: { itemId: number }) {
    const { itemId } = params;

    const item = await ItemsEquipmentModel.findOne({ itemId }).lean();
    //console.log(`Found item with id: ${itemId}: `, item);
    if (!item) {
      throw new CustomError(`Item with id '${itemId}' not found`, 404);
    }

    return item;
  }
}