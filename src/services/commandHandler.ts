import { CreateCharacterEquipment } from '../commands/characterEquipment/create';
import { CharacterEquipmentModel } from '../models/characterEquipment';

export class CommandHandler {
  async handle(command: any) {
    if (command instanceof CreateCharacterEquipment) {
      const { characterEquipment } = command.body;

      return await CharacterEquipmentModel.create(characterEquipment);
    }
  }
}
