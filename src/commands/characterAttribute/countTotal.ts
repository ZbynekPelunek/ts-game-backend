import { CharacterAttributeService } from '../../services/characterAttributeService';
import { CharacterEquipmentService } from '../../services/characterEquipmentService';

export class CountTotalCommand {
  constructor(
    private characterAttributeService: CharacterAttributeService,
    private characterEquipmentService: CharacterEquipmentService
  ) {}

  async execute(data: { characterId: string }) {
    const { characterId } = data;

    const equipment =
      await this.characterEquipmentService.listCharacterEquipment({
        characterId,
      });

    const equippedItems = equipment.map((e) => e.itemId);
  }
}
