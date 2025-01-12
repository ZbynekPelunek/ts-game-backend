import { CharacterAttributeCreateDTO } from '../../../../shared/src';
import { CharacterAttributeService } from '../../services/characterAttributeService';

export class CreateBundleCharacterAttributeCommand {
  constructor(private characterAttributeService: CharacterAttributeService) {}

  async execute(body: CharacterAttributeCreateDTO[]) {
    await this.characterAttributeService.createBundleCharacterAttribute(body);
  }
}
