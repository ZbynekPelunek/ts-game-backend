import Joi from 'joi';

import {
  CreateCharacterAttributeRequestDTO,
  ListCharacterAttributesRequestQuery,
  MainAttributeNames,
  MiscAttributeNames,
  PrimaryAttributeNames,
  SecondaryAttributeNames
} from '../../../shared/src';
import { validObjectIdCheck } from '../utils/joiCustomMethods';

export const listCharacterAttributesQuerySchema =
  Joi.object<ListCharacterAttributesRequestQuery>({
    populateAttribute: Joi.boolean(),
    characterId: Joi.string().custom(validObjectIdCheck)
  });

export const createCharacterAttributeBodySchema =
  Joi.object<CreateCharacterAttributeRequestDTO>({
    characterId: Joi.string().required().custom(validObjectIdCheck),
    attributeName: Joi.string()
      .required()
      .valid(...Object.values(MainAttributeNames))
      .valid(...Object.values(PrimaryAttributeNames))
      .valid(...Object.values(SecondaryAttributeNames))
      .valid(...Object.values(MiscAttributeNames)),
    baseValue: Joi.number().required(),
    addedValue: Joi.object({
      equipment: Joi.number(),
      otherAttributes: Joi.number()
    })
  }).required();
