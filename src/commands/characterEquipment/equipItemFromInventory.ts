import { CustomError } from '../../middleware/errorHandler';
import { startTransaction } from '../../mongoDB.handler';
import { CharacterEquipmentService } from '../../services/characterEquipmentService';
import { InventoryService } from '../../services/inventoryService';
import { ItemService } from '../../services/itemService';

export class EquipItemFromInventoryCommand {
  constructor(
    private characterEquipmentService: CharacterEquipmentService,
    private inventoryService: InventoryService,
    private itemService: ItemService
  ) {}

  async execute(body: {
    itemId: number | null;
    characterId: string;
    inventoryId: string;
  }) {
    const { itemId, characterId, inventoryId } = body;
    const session = await startTransaction();

    if (!itemId) {
      throw new CustomError('No item to equip', 400);
    }

    const item = await this.itemService.getById({ itemId });

    const characterEquipmentSlot =
      await this.characterEquipmentService.listCharacterEquipment({
        characterId,
        itemSlot: item.slot,
      });

    if (characterEquipmentSlot.length < 1) {
      throw new CustomError('Unknown equipment slot', 400);
    }

    const characterEquipmentId = characterEquipmentSlot[0]._id.toString();

    if (characterEquipmentSlot[0].itemId !== null) {
      try {
        session.startTransaction();

        await this.inventoryService.updateInventoryItem(inventoryId, {
          itemId,
          amount: 1,
        });

        await this.characterEquipmentService.updateEquipmentItem(
          characterEquipmentId,
          itemId
        );

        await session.commitTransaction();
      } catch (error) {
        console.error('Inventory to Equipment transaction error: ', error);
        await session.abortTransaction();
        throw new CustomError(
          'Error while transfering item from inventory to equipment',
          500
        );
      } finally {
        session.endSession();
      }
    } else {
      try {
        session.startTransaction();

        await this.inventoryService.updateInventoryItem(inventoryId, null);

        await this.characterEquipmentService.updateEquipmentItem(
          characterEquipmentId,
          itemId
        );

        await session.commitTransaction();
      } catch (error) {
        console.error('Inventory to Equipment transaction error: ', error);
        await session.abortTransaction();
        throw new CustomError(
          'Error while transfering item from inventory to equipment',
          500
        );
      } finally {
        session.endSession();
      }
    }
  }
}
