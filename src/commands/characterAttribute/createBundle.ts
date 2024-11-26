import { CharacterAttributeCreateDTO } from '../../../../shared/src';
import { CharacterAttributeService } from '../../services/characterAttributeService';

export class CreateBundleCharacterAttributeCommand {
  constructor(private characterAttributeService: CharacterAttributeService) {}

  async execute(body: CharacterAttributeCreateDTO[]) {
    const characterAttribute =
      await this.characterAttributeService.createBundleCharacterAttribute(body);

    return this.characterAttributeService.transformResponse(characterAttribute);
  }
}
