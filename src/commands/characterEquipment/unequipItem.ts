import { CustomError } from '../../middleware/errorHandler';
import { startTransaction } from '../../mongoDB.handler';
import { CharacterAttributeService } from '../../services/characterAttributeService';
import { CharacterEquipmentService } from '../../services/characterEquipmentService';
import { InventoryService } from '../../services/inventoryService';
import { ItemService } from '../../services/itemService';

export class UnequipItemCommand {
  constructor(
    private characterEquipmentService: CharacterEquipmentService,
    private inventoryService: InventoryService,
    private characterAttributeService: CharacterAttributeService,
    private itemService: ItemService
  ) {}

  async execute(characterEquipmentId: string) {
    const session = await startTransaction();
    const characterEquipmentData =
      await this.characterEquipmentService.getById(characterEquipmentId);
    const characterId = characterEquipmentData.characterId.toString();
    const itemToUnequip = characterEquipmentData.itemId;

    if (!itemToUnequip) {
      throw new CustomError('No item to unequip', 400);
    }

    const equippedItem = await this.itemService.getById({
      itemId: itemToUnequip,
    });

    try {
      session.startTransaction();

      await this.inventoryService.addItemToFreeSlot(
        characterId,
        itemToUnequip,
        1
      );

      await this.characterEquipmentService.updateEquipmentItem(
        characterEquipmentId,
        null
      );

      console.log('Updating attributes from old item...');
      await this.characterAttributeService.decreaseMultipleAttributeEquipmentValues(
        {
          characterId,
          attributes: equippedItem.attributes,
        }
      );
      console.log('...updating attributes done.');

      await session.commitTransaction();
    } catch (error) {
      console.error('Equipment to Inventory transaction error: ', error);
      await session.abortTransaction();
      throw new CustomError(
        'Error while transfering item from Equipment to Inventory',
        500
      );
    } finally {
      session.endSession();
    }
  }
}
