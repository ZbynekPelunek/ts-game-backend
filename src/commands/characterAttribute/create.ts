import { CharacterAttributeCreateDTO } from '../../../../shared/src';
import { CharacterAttributeService } from '../../services/characterAttributeService';

export class CreateCharacterAttributeCommand {
  constructor(private characterAttributeService: CharacterAttributeService) {}

  async execute(body: CharacterAttributeCreateDTO) {
    const characterAttribute =
      await this.characterAttributeService.createCharacterAttribute(body);

    return this.characterAttributeService.transformResponse(characterAttribute);
  }
}
