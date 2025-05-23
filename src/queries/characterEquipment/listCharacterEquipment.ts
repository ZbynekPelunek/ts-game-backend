import { ListCharacterEquipmentsRequestQuery } from '../../../../shared/src';
import { CharacterEquipmentService } from '../../services/characterEquipment.service';

export class ListCharacterEquipmentQuery {
  constructor(private characterEquipmentService: CharacterEquipmentService) {}

  async execute(queryParams: ListCharacterEquipmentsRequestQuery) {
    const characterEquipment =
      await this.characterEquipmentService.listCharacterEquipment(queryParams);

    return this.characterEquipmentService.transformResponseArray(
      characterEquipment
    );
  }
}
