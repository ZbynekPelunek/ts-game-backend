import {
  CommonItemParams,
  InventoryBackend,
  InventoryFrontend,
} from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler';
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
        foreignField: 'itemId',
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

  //async updateInventorySlot() {}

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
        $set: { item },
      },
      { returnDocument: 'after' }
    );

    if (!updateRes) {
      throw new CustomError('Something went wrong while updating', 500);
    }
    return updateRes;
  }

  async sendEquippedItemToInventory() {
    // currentCharacterEquipmentItem: { itemId: number } // characterId: string,
    throw new Error(
      'Method NYI: inventoryService.sendEquippedItemToInventory()'
    );
    // const inventorySlot = await this.listInventorySlots({
    //   characterId,
    //   slot: 1,
    // });
    // const inventorySlotId = inventorySlot[0]._id;
    // await this.updateInventoryItem(inventorySlotId, {item});
  }

  private transformResponseObject(
    databaseResponse: InventoryBackend
  ): InventoryFrontend {
    return {
      slot: databaseResponse.slot,
      item: databaseResponse.item,
      _id: databaseResponse._id!.toString(),
      characterId: databaseResponse.characterId.toString(),
    };
  }

  private transformResponseArray(
    databaseResponse: InventoryBackend[]
  ): InventoryFrontend[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
