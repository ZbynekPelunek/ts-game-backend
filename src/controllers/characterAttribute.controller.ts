import { Request, Response } from 'express';
import { Document } from 'mongoose';

import {
  BasicAttributeBackend,
  CharacterAttributeFrontend,
  Request_CharacterAttribute_GET_all_query,
  Request_CharacterAttribute_POST_body,
  Response_CharacterAttribute_GET_all,
  Response_CharacterAttribute_POST,
} from '../../../shared/src';
import {
  CharacterAttributeModel,
  CharacterAttributeSchema,
} from '../models/characterAttribute.model';

export class CharacterAttributeController {
  async getAll(
    req: Request<{}, {}, {}, Request_CharacterAttribute_GET_all_query>,
    res: Response<Response_CharacterAttribute_GET_all>
  ) {
    try {
      const { characterId } = req.query;
      const { populateAttribute } = req.query;

      if (!characterId) {
        const characterAttributes = await CharacterAttributeModel.find();

        const responseCharacterAttributesArr = characterAttributes.map((ca) => {
          return this.transformResponse(ca);
        });

        return res.status(200).json({
          success: true,
          characterAttributes: responseCharacterAttributesArr,
        });
      }

      let responseCharacterAttributes: CharacterAttributeFrontend[] = [];
      if (populateAttribute) {
        const populatedCharacterAttributes = await CharacterAttributeModel.find(
          {
            characterId: characterId,
          }
        ).populate<{ attributeId: BasicAttributeBackend }>({
          path: 'attributeId',
          select: '-createdAt -updatedAt -__v',
        });

        responseCharacterAttributes = populatedCharacterAttributes.map((ca) => {
          return {
            characterAttributeId: ca._id.toString(),
            characterId,
            addedValue: ca.addedValue,
            baseValue: ca.baseValue,
            statsAddedValue: ca.statsAddedValue,
            totalValue: ca.totalValue,
            attributeId: ca.attributeId._id.toString(),
            attribute: ca.attributeId,
          };
        });
      } else {
        const characterAttributes = await CharacterAttributeModel.find({
          characterId: characterId,
        });

        responseCharacterAttributes = characterAttributes.map((ca) => {
          return this.transformResponse(ca, characterId);
        });
      }

      // console.log(
      //   'GET character Attributes response: ',
      //   responseCharacterAttributes
      // );

      return res.status(200).json({
        success: true,
        characterAttributes: responseCharacterAttributes,
      });
    } catch (error) {
      console.log('Character Attribute GET ALL err:', error);
      return res.status(500).json({
        success: false,
        error: 'Character Attribute Get All Error [TBI]',
      });
    }
  }

  async post(
    req: Request<{}, {}, Request_CharacterAttribute_POST_body>,
    res: Response<Response_CharacterAttribute_POST>
  ) {
    try {
      const { characterAttributes } = req.body;

      // typescript only makes the characterAttributesCreated as object type instead of either object or array
      const characterAttributesCreated =
        await CharacterAttributeModel.create(characterAttributes);

      // console.log('characterAttributesCreated: ', characterAttributesCreated);
      let responseArr: CharacterAttributeFrontend[] = [];
      if (Array.isArray(characterAttributesCreated)) {
        responseArr = characterAttributesCreated.map((ca) => {
          return this.transformResponse(ca);
        });
      } else {
        const charAttributeResponse: CharacterAttributeFrontend =
          this.transformResponse(characterAttributesCreated);
        responseArr.push(charAttributeResponse);
      }

      return res
        .status(201)
        .json({ success: true, characterAttributes: responseArr });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Character Attribute Post Error [TBI]',
      });
    }
  }

  private transformResponse = (
    databaseResponse: CharacterAttributeSchema & Document,
    characterId: string | undefined = undefined
  ) => {
    return {
      addedValue: databaseResponse.addedValue,
      attributeId: databaseResponse.attributeId.toString(),
      baseValue: databaseResponse.baseValue,
      characterAttributeId: databaseResponse.id,
      characterId: characterId ?? databaseResponse.characterId.toString(),
      statsAddedValue: databaseResponse.statsAddedValue,
      totalValue: databaseResponse.totalValue,
    };
  };
}
