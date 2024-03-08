import express, { Request, Response } from 'express';
import { Document } from 'mongoose';

import {
  BasicAttributeBackend,
  CharacterAttributeFrontend,
  Request_CharacterAttributes_GET_all_query,
  Request_CharacterAttributes_POST_body,
  Response_CharacterAttributes_GET_all,
  Response_CharacterAttributes_POST,
} from '../../../shared/src';
import { CharacterAttributeModel, CharacterAttributeSchema } from '../schema/characterAttribute.schema';

export const characterAttributesRouter = express.Router();

characterAttributesRouter.get('', async (req: Request<{}, {}, {}, Request_CharacterAttributes_GET_all_query>, res: Response<Response_CharacterAttributes_GET_all>) => {
  const { characterId } = req.query;
  const { populateAttribute } = req.query;
  console.log('GET characters with: ', characterId);

  if (!characterId) {
    const characterAttributes = await CharacterAttributeModel.find();

    const responseCharacterAttributesArr = characterAttributes.map(ca => {
      return transformResponse(ca);
    });

    return res.status(200).json({ success: true, characterAttributes: responseCharacterAttributesArr });
  }

  let responseCharacterAttributes: CharacterAttributeFrontend[] = [];
  if (populateAttribute) {
    const populatedCharacterAttributes = await CharacterAttributeModel.find({ characterId: characterId }).populate<{ attributeId: BasicAttributeBackend }>({ path: 'attributeId', select: '-createdAt -updatedAt -__v' });

    responseCharacterAttributes = populatedCharacterAttributes.map(ca => {
      return {
        characterAttributeId: ca._id.toString(),
        characterId,
        addedValue: ca.addedValue,
        baseValue: ca.baseValue,
        statsAddedValue: ca.statsAddedValue,
        totalValue: ca.totalValue,
        attributeId: ca.attributeId._id.toString(),
        attribute: ca.attributeId
      }
    });
  } else {
    const characterAttributes = await CharacterAttributeModel.find({ characterId: characterId });

    responseCharacterAttributes = characterAttributes.map(ca => {
      return transformResponse(ca, characterId)
    });
  }

  // console.log('GET character Attributes response: ', responseCharacterAttributes[0]);

  return res.status(200).json({ success: true, characterAttributes: responseCharacterAttributes });
});

characterAttributesRouter.post('', async (req: Request<{}, {}, Request_CharacterAttributes_POST_body>, res: Response<Response_CharacterAttributes_POST>) => {
  try {
    const { characterAttributes } = req.body;

    // typescript only makes the characterAttributesCreated as object type instead of either object or array
    const characterAttributesCreated = await CharacterAttributeModel.create(characterAttributes);

    // console.log('characterAttributesCreated: ', characterAttributesCreated);
    let responseArr: CharacterAttributeFrontend[] = [];
    if (Array.isArray(characterAttributesCreated)) {
      responseArr = characterAttributesCreated.map(ca => {
        return transformResponse(ca);
      })
    } else {
      const charAttributeResponse: CharacterAttributeFrontend = transformResponse(characterAttributesCreated);
      responseArr.push(charAttributeResponse);
    }

    return res.status(201).json({ success: true, characterAttributes: responseArr });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

const transformResponse = (databaseResponse: CharacterAttributeSchema & Document, characterId: string | undefined = undefined): CharacterAttributeFrontend => {
  return {
    addedValue: databaseResponse.addedValue,
    attributeId: databaseResponse.attributeId.toString(),
    baseValue: databaseResponse.baseValue,
    characterAttributeId: databaseResponse.id,
    characterId: characterId ?? databaseResponse.characterId.toString(),
    statsAddedValue: databaseResponse.statsAddedValue,
    totalValue: databaseResponse.totalValue
  }
}