import axios from 'axios';
import express, { Request, Response } from 'express';

import {
  BasicAttributeBackend,
  CharacterAttributeFrontend,
  Request_CharacterAttributes_GET_all_query,
  Request_CharacterAttributes_POST_body,
  Response_Attributes_GET_all,
  Response_CharacterAttributes_GET_all,
  Response_CharacterAttributes_POST,
} from '../../../shared/src';
import { generateDefaultCharacterAttributes } from '../defaultCharacterData/attributes';
import { CharacterAttributeModel } from '../schema/characterAttribute.schema';

export const characterAttributesRouter = express.Router();

characterAttributesRouter.get('', async (req: Request<{}, {}, {}, Request_CharacterAttributes_GET_all_query>, res: Response<Response_CharacterAttributes_GET_all>) => {
  const { characterId } = req.query;
  const { populateAttribute } = req.query;
  console.log('GET characters with: ', characterId);

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
      return {
        characterAttributeId: ca._id.toString(),
        characterId,
        addedValue: ca.addedValue,
        baseValue: ca.baseValue,
        statsAddedValue: ca.statsAddedValue,
        totalValue: ca.totalValue,
        attributeId: ca._id.toString()
      }
    });
  }

  // console.log('GET character Attributes response: ', responseCharacterAttributes[0]);

  return res.status(200).json({ success: true, characterAttributes: responseCharacterAttributes });
})

characterAttributesRouter.post('', async (req: Request<{}, {}, Request_CharacterAttributes_POST_body>, res: Response<Response_CharacterAttributes_POST>) => {
  const { characterId } = req.body;
  console.log('creating character attributes for character: ', characterId);

  const allAttributesResponse = await axios.get<Response_Attributes_GET_all>('http://localhost:3000/api/v1/attributes');

  if (!allAttributesResponse.data.success) {
    return res.status(500).json({ success: false, error: 'Couldnt GET all attributes' });
  }
  const defaultCharacterAttributes = generateDefaultCharacterAttributes(allAttributesResponse.data.attributes, characterId);

  const characterAttributes = await CharacterAttributeModel.create(defaultCharacterAttributes);

  //console.log('characterAttributes after model create: ', characterAttributes);
  const responseArr = characterAttributes.map(ca => ca._id);

  return res.status(201).json({ success: true, characterAttributes: responseArr });
})

// characterAttributesRouter.patch('', async (req: Request<{}, {}, { characterId: string; characterAttributes: CharacterAttributeFrontend[]; }>, res: Response) => {
//   const { characterId } = req.body;
//   const {characterAttributes} = req.body;

//   const calculatedAttributes = calculateAttributes(characterAttributes);


// })