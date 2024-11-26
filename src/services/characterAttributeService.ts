import {
  CharacterAttributeCreateDTO,
  CharacterAttributeDocument,
  CharacterAttributeDTO,
  CharacterAttributeListQueryParams,
} from '../../../shared/src';
import { CharacterAttributeModel } from '../models/characterAttribute';

export class CharacterAttributeService {
  async listCharacterAttribute(queryParams: CharacterAttributeListQueryParams) {
    const { characterId, populateAttribute } = queryParams;
    const charEquipQuery = CharacterAttributeModel.find();

    if (characterId) charEquipQuery.where({ characterId });
    if (populateAttribute)
      charEquipQuery.populate({
        path: 'attributeName',
        select: '-createdAt -updatedAt -__v',
      });

    return await charEquipQuery.exec();
  }

  async createCharacterAttribute(body: CharacterAttributeCreateDTO) {
    return await CharacterAttributeModel.create(body);
  }

  async createBundleCharacterAttribute(body: CharacterAttributeCreateDTO[]) {
    return await CharacterAttributeModel.create(body);
  }

  public transformResponse(
    databaseResponse: CharacterAttributeDocument[]
  ): CharacterAttributeDTO[];
  public transformResponse(
    databaseResponse: CharacterAttributeDocument
  ): CharacterAttributeDTO;
  public transformResponse(
    databaseResponse: CharacterAttributeDocument | CharacterAttributeDocument[]
  ): CharacterAttributeDTO | CharacterAttributeDTO[] {
    if (Array.isArray(databaseResponse)) {
      return this.transformResponseArray(databaseResponse);
    } else {
      return this.transformResponseObject(databaseResponse);
    }
  }

  private transformResponseObject(
    databaseResponse: CharacterAttributeDocument
  ): CharacterAttributeDTO {
    const {
      id,
      baseValue,
      addedValue,
      totalValue,
      characterId,
      attributeName,
      attribute,
    } = databaseResponse;

    return {
      id,
      baseValue: baseValue ?? 0,
      addedValue: {
        equipment: addedValue?.equipment ?? 0,
        otherAttributes: addedValue?.otherAttributes ?? 0,
      },
      totalValue: totalValue ?? 0,
      characterId: characterId.toString(),
      attributeName,
      attribute,
    };
  }

  private transformResponseArray(
    databaseResponse: CharacterAttributeDocument[]
  ): CharacterAttributeDTO[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
