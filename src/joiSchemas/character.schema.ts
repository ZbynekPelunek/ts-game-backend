import Joi from 'joi';

import {
  CharacterClass,
  CharacterRace,
  CreateCharacterRequestDTO,
  DeleteCharacterRequestParams,
  GetCharacterRequestParams,
  UpdateCharacterRequestDTO,
  UpdateCharacterRequestParams
} from '../../../shared/src';
import {
  CHARACTER_NAME_MIN_LENGTH,
  CHARACTER_NAME_MAX_LENGTH
} from '../models/character.model';
import { validObjectIdCheck } from '../utils/joiCustomMethods';

export const getCharacterParamsSchema = Joi.object<GetCharacterRequestParams>({
  characterId: Joi.string().required().custom(validObjectIdCheck)
});

export const createCharacterBodySchema = Joi.object<CreateCharacterRequestDTO>({
  name: Joi.string()
    .required()
    .min(CHARACTER_NAME_MIN_LENGTH)
    .max(CHARACTER_NAME_MAX_LENGTH)
    .pattern(/^[A-Za-z]+$/)
    .messages({
      'string.empty': `"name" is required`,
      'string.pattern.base': `"name" may only contain alphabetic characters (A–Z)`
    }),
  race: Joi.string()
    .required()
    .valid(...Object.values(CharacterRace)),
  characterClass: Joi.string()
    .required()
    .valid(...Object.values(CharacterClass))
}).required();

export const updateCharacterParamsSchema =
  Joi.object<UpdateCharacterRequestParams>({
    characterId: Joi.string().required().custom(validObjectIdCheck)
  });

export const updateCharacterBodySchema = Joi.object<UpdateCharacterRequestDTO>({
  name: Joi.string()
    .min(CHARACTER_NAME_MIN_LENGTH)
    .max(CHARACTER_NAME_MAX_LENGTH)
    .pattern(/^[A-Za-z]+$/)
    .messages({
      'string.empty': `"name" is required`,
      'string.pattern.base': `"name" may only contain alphabetic characters (A–Z)`
    }),
  experience: Joi.number()
}).required();

export const deleteCharacterParamsSchema =
  Joi.object<DeleteCharacterRequestParams>({
    characterId: Joi.string().required().custom(validObjectIdCheck)
  });
