import {
  CommonItemParams,
  InventoryBackend,
  InventoryFrontend
} from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler.middleware';
import { InventoryModel } from '../models/inventory.model';

export class InventoryService {
  async listInventorySlots(queryParams: {
    characterId?: string;
    slot?: number;
    populateItem?: boolean;
  }) {
    const { characterId, slot, populateItem } = queryParams;

    const query = InventoryModel.find().sort({ slot: 1 }).lean();

    if (characterId) query.where({ characterId });
    if (slot) query.where({ slot });
    if (populateItem)
      query.populate<{ itemId: CommonItemParams }>({
        path: 'item.itemId',
        select: '-createdAt -updatedAt -__v',
        localField: 'itemId',
        foreignField: 'itemId'
      });

    const inventory = await query.exec();
    return this.transformResponseArray(inventory);
  }

  async getInventorySlotById(params: { inventorySlotId: string }) {
    const { inventorySlotId } = params;

    const inventorySlotData =
      await InventoryModel.findById(inventorySlotId).lean();
    if (!inventorySlotData) {
      throw new CustomError(
        `Inventory slot with id '${inventorySlotId}' does not exist`,
        404
      );
    }

    return this.transformResponseObject(inventorySlotData);
  }

  async addItemToFreeSlot(characterId: string, itemId: number, amount: number) {
    const allCharacterItemSlots = await InventoryModel.find({
      characterId
    })
      .sort({ slot: 1 })
      .lean();

    if (!allCharacterItemSlots) {
      throw new CustomError('No character inventory data found', 500);
    }

    const freeCharacterItemSlots = allCharacterItemSlots.filter((i) => !i.item);
    //console.log('freeCharacterItemSlots: ', freeCharacterItemSlots);

    if (freeCharacterItemSlots.length === 0) {
      throw new CustomError('Inventory is full', 400);
    }

    const firstFreeSlot = freeCharacterItemSlots[0];

    await InventoryModel.findOneAndUpdate(
      { slot: firstFreeSlot.slot, characterId },
      { item: { itemId, amount } }
    );
  }

  async updateInventoryItem(
    inventoryId: string,
    item: {
      itemId: number;
      amount: number;
    } | null
  ) {
    const updateRes = InventoryModel.findByIdAndUpdate(
      inventoryId,
      {
        $set: { item }
      },
      { returnDocument: 'after' }
    );

    if (!updateRes) {
      throw new CustomError('Something went wrong while updating', 500);
    }
    return updateRes;
  }

  transformResponseObject(
    databaseResponse: InventoryBackend
  ): InventoryFrontend {
    return {
      slot: databaseResponse.slot,
      item: databaseResponse.item,
      _id: databaseResponse._id!.toString(),
      characterId: databaseResponse.characterId.toString()
    };
  }

  transformResponseArray(
    databaseResponse: InventoryBackend[]
  ): InventoryFrontend[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
