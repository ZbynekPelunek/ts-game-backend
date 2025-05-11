import {
  AttributeName,
  CharacterAttributeDocument,
  CharacterAttributeDTO,
  CreateCharacterAttributeRequestDTO,
  ItemAttribute,
  ListCharacterAttributesRequestQuery
} from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler.middleware';
import { CharacterModel } from '../models/character.model';
import { CharacterAttributeModel } from '../models/characterAttribute.model';

export class CharacterAttributeService {
  async list(queryParams: ListCharacterAttributesRequestQuery) {
    const { characterId, populateAttribute } = queryParams;
    const charAttributeQuery = CharacterAttributeModel.find();

    if (characterId) charAttributeQuery.where({ characterId });
    if (populateAttribute) charAttributeQuery.populate('attribute');

    const characterAttributes = await charAttributeQuery.exec();

    return this.transformResponse(characterAttributes);
  }

  async create(body: CreateCharacterAttributeRequestDTO) {
    const { attributeName, baseValue, characterId, addedValue } = body;

    const character = await CharacterModel.findById(characterId);

    if (!character) {
      throw new CustomError(
        `Character with id '${characterId}' does not exist.`,
        400
      );
    }

    const characterAttributeExist = await CharacterAttributeModel.findOne({
      characterId,
      attributeName
    });

    if (characterAttributeExist) {
      throw new CustomError(`Character has already this attribute.`, 400);
    }

    const newCharacterAttribute = await CharacterAttributeModel.create({
      addedValue,
      attributeName,
      baseValue,
      characterId
    });

    return this.transformResponse(newCharacterAttribute);
  }

  async increaseMultipleAttributeEquipmentValues(body: {
    characterId: string;
    attributes: ItemAttribute[];
  }) {
    const bulkOperations = body.attributes.map(
      ({ attributeName, attributeValue }) => ({
        updateOne: {
          filter: { attributeName, characterId: body.characterId },
          update: {
            $inc: {
              'addedValue.equipment': attributeValue,
              totalValue: attributeValue
            }
          }
        }
      })
    );

    //console.log('bulkOperations: ', bulkOperations);

    return await CharacterAttributeModel.bulkWrite(bulkOperations);
  }

  async decreaseMultipleAttributeEquipmentValues(body: {
    characterId: string;
    attributes: ItemAttribute[];
  }) {
    const bulkOperations = body.attributes.map(
      ({ attributeName, attributeValue }) => ({
        updateOne: {
          filter: { attributeName, characterId: body.characterId },
          update: {
            $inc: {
              'addedValue.equipment': -attributeValue,
              totalValue: -attributeValue
            }
          }
        }
      })
    );

    //console.log('bulkOperations: ', bulkOperations);

    return await CharacterAttributeModel.bulkWrite(bulkOperations);
  }

  async increaseCharacterAttributeValue(body: {
    characterId: string;
    attributeName: AttributeName;
    addedValue: number;
    source: 'equipment' | 'other';
  }) {
    switch (body.source) {
      case 'equipment':
        return await CharacterAttributeModel.updateOne(
          { characterId: body.characterId, attributeName: body.attributeName },
          {
            $inc: {
              'addedValue.equipment': body.addedValue,
              totalValue: body.addedValue
            }
          }
        );
      case 'other':
        return await CharacterAttributeModel.updateOne(
          { characterId: body.characterId, attributeName: body.attributeName },
          {
            $inc: {
              'addedValue.otherAttributes': body.addedValue,
              totalValue: body.addedValue
            }
          }
        );
      default:
        throw new CustomError('Unknown attribute source.', 500);
    }
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
      baseValue,
      addedValue,
      totalValue,
      characterId,
      attributeName,
      attribute
    } = databaseResponse;

    return {
      baseValue: baseValue ?? 0,
      addedValue: {
        equipment: addedValue?.equipment ?? 0,
        otherAttributes: addedValue?.otherAttributes ?? 0
      },
      totalValue: totalValue ?? 0,
      characterId: characterId.toString(),
      attributeName,
      attribute
    };
  }

  private transformResponseArray(
    databaseResponse: CharacterAttributeDocument[]
  ): CharacterAttributeDTO[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
