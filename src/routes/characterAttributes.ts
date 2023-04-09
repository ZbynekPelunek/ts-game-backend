import express, { Request, Response } from 'express';
import { Types } from 'mongoose';

import { CharacterAttribute } from '../../../shared/src';
import { defaultCharacterAttributes } from '../defaultCharacterData/attributes';
import { calculateAttributes } from '../engine/attributes';
import { CharacterAttributeModel } from '../schema/characterAttribute.schema';

export const characterAttributesRouter = express.Router();

characterAttributesRouter.get('', async (req: Request<{}, {}, {}, { characterId: Types.ObjectId }>, res: Response) => {
  const { characterId } = req.query;
  console.log('GET characterAttributesRouter query characterId: ', characterId);

  const characterAttributes: CharacterAttribute[] = await CharacterAttributeModel.find({ characterId: characterId });

  return res.status(200).json({ success: true, characterAttributes });
})

characterAttributesRouter.post('', async (req: Request<{}, {}, { characterId: Types.ObjectId; }>, res: Response) => {
  const { characterId } = req.body;
  console.log('creating character attributes for character: ', characterId);

  const calculatedStats = calculateAttributes(defaultCharacterAttributes);

  const defaultStats = calculatedStats.map(ca => {
    return { ...ca, characterId }
  })


  const characterAttributes = await CharacterAttributeModel.create(defaultStats);
  //console.log('characterAttributes after model create: ', characterAttributes);
  const responseArr = characterAttributes.map(ca => {
    return { _id: ca._id }
  })

  return res.status(201).json({ success: true, characterAttributes: responseArr });
})