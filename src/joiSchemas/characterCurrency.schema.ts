import Joi from 'joi';
import {
  CreateCharacterCurrencyRequestDTO,
  CurrencyId,
  ListCharacterCurrenciesQuery,
  UpdateCharacterCurrencyRequestDTO,
  UpdateCharacterCurrencyRequestParams
} from '../../../shared/src';
import { validObjectIdCheck } from '../utils/joiCustomMethods';

export const listCharacterCurrenciesQuerySchema =
  Joi.object<ListCharacterCurrenciesQuery>({
    characterId: Joi.string().custom(validObjectIdCheck),
    currencyId: Joi.string().valid(...Object.values(CurrencyId)),
    populateCurrency: Joi.boolean()
  });

export const createCharacterCurrencyBodySchema =
  Joi.object<CreateCharacterCurrencyRequestDTO>({
    amount: Joi.number().required(),
    characterId: Joi.string().custom(validObjectIdCheck).required(),
    currencyId: Joi.string()
      .valid(...Object.values(CurrencyId))
      .required()
  }).required();

export const updateCharacterCurrencyParamsSchema =
  Joi.object<UpdateCharacterCurrencyRequestParams>({
    characterCurrencyId: Joi.string().custom(validObjectIdCheck)
  }).required();
export const updateCharacterCurrencyBodySchema =
  Joi.object<UpdateCharacterCurrencyRequestDTO>({
    amount: Joi.number()
  }).required();
