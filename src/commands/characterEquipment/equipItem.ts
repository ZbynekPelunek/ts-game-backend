import { CustomError } from '../../middleware/errorHandler';
import { CharacterEquipmentService } from '../../services/characterEquipmentService';
import { InventoryService } from '../../services/inventoryService';
import { ItemService } from '../../services/itemService';

export class EquipItemCommand {
  constructor(
    private characterEquipmentService: CharacterEquipmentService,
    private itemService: ItemService,
    private inventoryService: InventoryService
  ) {}

  async execute(characterEquipmentId: string, itemId: number | null) {
    if (!itemId) {
      throw new CustomError('No item to equip', 400);
    }
    // Get character equipment data
    const characterEquipmentData =
      await this.characterEquipmentService.getById(characterEquipmentId);
    //const characterId = characterEquipmentData.characterId.toString();
    const currentCharacterEquipmentItem = characterEquipmentData.itemId;

    // Return item to inventory if equipment slot is already occupied
    if (currentCharacterEquipmentItem) {
      await this.inventoryService.sendEquippedItemToInventory();
    }

    // Validate equipment slot
    const itemData = await this.itemService.getById({ itemId });
    if (
      !this.characterEquipmentService.isCorrectSlot(
        characterEquipmentData.slot,
        itemData.slot
      )
    ) {
      throw new CustomError('Wrong equipment slot', 400);
    }

    // Update character equipment with new item
    const updateRes = await this.characterEquipmentService.updateEquipmentItem(
      characterEquipmentId,
      itemId
    );
    if (!updateRes) {
      throw new CustomError('Something went wrong while updating', 500);
    }
    return this.characterEquipmentService.transformResponseObject(updateRes);
  }
}
