import { Request, Response } from 'express-serve-static-core';

import {
  ListCharacterAttributesRequestQuery,
  CreateCharacterAttributeResponse,
  ListCharacterAttributesResponse,
  CharacterAttributeDTO,
  CreateCharacterAttributeRequestDTO
} from '../../../shared/src';
import { CharacterAttributeService } from '../services/characterAttribute.service';
import { AuthenticatedResponse } from '../middleware/auth.middleware';

export class CharacterAttributeController {
  private readonly characterAttributeService: CharacterAttributeService;

  constructor() {
    this.characterAttributeService = new CharacterAttributeService();
  }

  async list(
    req: Request<{}, {}, {}, ListCharacterAttributesRequestQuery>,
    res: AuthenticatedResponse<ListCharacterAttributesResponse>
  ) {
    const { characterId, populateAttribute } = req.query;

    const characterAttributes = await this.characterAttributeService.list({
      characterId,
      populateAttribute
    });

    res.status(200).json({
      success: true,
      characterAttributes: characterAttributes.map((charAtt) => {
        const characterAttribute: CharacterAttributeDTO = {
          characterId: charAtt.characterId,
          baseValue: charAtt.baseValue,
          addedValue: {
            equipment: charAtt.addedValue.equipment,
            otherAttributes: charAtt.addedValue.otherAttributes
          },
          totalValue: charAtt.totalValue,
          attributeName: charAtt.attributeName
        };
        if (!populateAttribute) {
          return characterAttribute;
        }

        return {
          ...characterAttribute,
          attribute: {
            attributeName: charAtt.attribute?.attributeName!,
            isPercent: charAtt.attribute?.isPercent!,
            label: charAtt.attribute?.label!,
            desc: charAtt.attribute?.desc
          }
        };
      })
    });
  }

  async create(
    req: Request<{}, {}, CreateCharacterAttributeRequestDTO>,
    res: Response<CreateCharacterAttributeResponse>
  ) {
    const { addedValue, attributeName, baseValue, characterId } = req.body;

    const characterAttributeCreated =
      await this.characterAttributeService.create({
        addedValue,
        attributeName,
        baseValue,
        characterId
      });

    res.status(201).json({
      success: true,
      characterAttribute: {
        characterId: characterAttributeCreated.characterId,
        baseValue: characterAttributeCreated.baseValue,
        addedValue: {
          equipment: characterAttributeCreated.addedValue.equipment,
          otherAttributes: characterAttributeCreated.addedValue.otherAttributes
        },
        totalValue: characterAttributeCreated.totalValue,
        attributeName: characterAttributeCreated.attributeName
      }
    });
  }
}
