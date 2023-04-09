import express, { Request, Response } from 'express';

import {
  CharacterAttributeBackend,
  CharacterAttributeFrontend,
  Request_CharacterAttributes_GET_all_query,
  Request_CharacterAttributes_POST_body,
  Response_CharacterAttributes_GET_all,
  Response_CharacterAttributes_POST,
} from '../../../shared/src';
import { defaultCharacterAttributes } from '../defaultCharacterData/attributes';
import { CharacterAttributeModel } from '../schema/characterAttribute.schema';

export const characterAttributesRouter = express.Router();

characterAttributesRouter.get('', async (req: Request<{}, {}, {}, Request_CharacterAttributes_GET_all_query>, res: Response<Response_CharacterAttributes_GET_all>) => {
  const { characterId } = req.query;

  const characterAttributes: CharacterAttributeBackend[] = await CharacterAttributeModel.find({ characterId: characterId });

  const responseCharacterAttributes: CharacterAttributeFrontend[] = characterAttributes.map(ca => {
    return {
      characterAttributeId: ca._id.toString(),
      characterId: characterId.toString(),
      "added-value": ca['added-value'],
      "base-value": ca['base-value'],
      "stats-added-value": ca['stats-added-value'],
      "total-value": ca['total-value'],
      attributeId: ca.attributeId
    }
  });

  return res.status(200).json({ success: true, characterAttributes: responseCharacterAttributes });
})

characterAttributesRouter.post('', async (req: Request<{}, {}, Request_CharacterAttributes_POST_body>, res: Response<Response_CharacterAttributes_POST>) => {
  const { characterId } = req.body;
  console.log('creating character attributes for character: ', characterId);

  //const calculatedStats = calculateAttributes(defaultCharacterAttributes);

  const defaultStats = defaultCharacterAttributes.map(ca => {
    return { ...ca, characterId }
  })


  const characterAttributes = await CharacterAttributeModel.create(defaultStats);
  //console.log('characterAttributes after model create: ', characterAttributes);
  const responseArr = characterAttributes.map(ca => {
    return { _id: ca._id }
  })

  return res.status(201).json({ success: true, characterAttributes: responseArr });
})