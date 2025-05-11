import { CustomError } from '../middleware/errorHandler.middleware';
import { EquipmentModel } from '../models/item.model';

export class ItemService {
  async getById(params: { itemId: number }) {
    const { itemId } = params;

    const item = await EquipmentModel.findOne({ itemId }).lean();
    //console.log(`Found item with id: ${itemId}: `, item);
    if (!item) {
      throw new CustomError(`Item with id '${itemId}' not found`, 404);
    }

    return item;
  }
}
