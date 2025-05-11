import { CustomError } from '../../middleware/errorHandler.middleware';
import { startTransaction } from '../../mongoDB.handler';
import { CharacterAttributeService } from '../../services/characterAttribute.service';
import { CharacterEquipmentService } from '../../services/characterEquipment.service';
import { InventoryService } from '../../services/inventory.service';
import { ItemService } from '../../services/item.service';

export class EquipItemFromInventoryCommand {
  constructor(
    private characterEquipmentService: CharacterEquipmentService,
    private inventoryService: InventoryService,
    private itemService: ItemService,
    private characterAttributeService: CharacterAttributeService
  ) {}

  async execute(body: { inventoryId: string }) {
    const { inventoryId } = body;
    const session = await startTransaction();

    const inventorySlot = await this.inventoryService.getInventorySlotById({
      inventorySlotId: inventoryId
    });
    const inventoryItem = inventorySlot.item;

    if (!inventoryItem) {
      throw new CustomError('No item to equip', 400);
    }

    const itemId = inventorySlot.item!.itemId as number;
    const characterId = inventorySlot.characterId;
    const inventoryItemDetails = await this.itemService.getById({ itemId });

    const characterEquipmentSlot =
      await this.characterEquipmentService.listCharacterEquipment({
        characterId,
        itemSlot: inventoryItemDetails.slot
      });

    if (characterEquipmentSlot.length < 1) {
      throw new CustomError('Unknown equipment slot', 400);
    }

    if (characterEquipmentSlot.length > 1) {
      throw new CustomError(
        `There should be only 1 equipment slot ${inventoryItemDetails.slot} for the character ${characterId}`,
        500
      );
    }

    const characterEquipmentId = characterEquipmentSlot[0]._id.toString();

    if (characterEquipmentSlot[0].itemId !== null) {
      const equippedItem = await this.itemService.getById({ itemId });
      try {
        session.startTransaction();

        console.log('Updating inventory...');
        await this.inventoryService.addItemToFreeSlot(
          characterId,
          equippedItem.itemId,
          1
        );
        console.log('...updating inventory done.');

        console.log('Updating equipment...');
        await this.characterEquipmentService.updateEquipmentItem(
          characterEquipmentId,
          itemId
        );
        console.log('...updating equipment done.');

        console.log('Updating attributes from old item...');
        await this.characterAttributeService.decreaseMultipleAttributeEquipmentValues(
          {
            characterId,
            attributes: equippedItem.attributes
          }
        );
        console.log('...updating attributes done.');

        console.log('Updating attributes from new item...');
        await this.characterAttributeService.increaseMultipleAttributeEquipmentValues(
          {
            characterId,
            attributes: inventoryItemDetails.attributes
          }
        );
        console.log('...updating attributes done.');

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

        console.log('Updating attributes...');
        await this.characterAttributeService.increaseMultipleAttributeEquipmentValues(
          {
            characterId,
            attributes: inventoryItemDetails.attributes
          }
        );
        console.log('...updating attributes done.');

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
