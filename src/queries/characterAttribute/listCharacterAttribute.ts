import { CharacterAttributeListQueryParams } from '../../../../shared/src';
import { CharacterAttributeService } from '../../services/characterAttributeService';

export class ListCharacterAttributeQuery {
  constructor(private characterAttributeService: CharacterAttributeService) {}

  async execute(queryParams: CharacterAttributeListQueryParams) {
    const characterAttribute =
      await this.characterAttributeService.listCharacterAttribute(queryParams);

    return this.characterAttributeService.transformResponse(characterAttribute);
  }
}
