import { CharacterEquipmentItem } from '../../../../shared/src';
import { CustomError } from '../../middleware/errorHandler';
import { CharacterEquipmentService } from '../../services/characterEquipmentService';
import { InventoryService } from '../../services/inventoryService';

export class UnequipItemCommand {
  constructor(
    private characterEquipmentService: CharacterEquipmentService,
    private inventoryService: InventoryService
  ) {}

  async execute(characterEquipmentId: string, itemId: number | null) {
    // const characterEquipmentData =
    //   await this.characterEquipmentService.getById(characterEquipmentId);
    // const characterId = characterEquipmentData.characterId.toString();

    if (!itemId) {
      throw new CustomError('No item to unequip', 400);
    }

    await this.inventoryService.sendEquippedItemToInventory();
    const updateRes = await this.characterEquipmentService.updateEquipmentItem(
      characterEquipmentId,
      null
    );
    if (!updateRes) {
      throw new CustomError('Something went wrong while updating', 500);
    }

    return this.characterEquipmentService.transformResponseObject(updateRes);
  }
}
