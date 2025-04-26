import Joi from 'joi';
import { CurrencyId, GetCurrencyRequestParams } from '../../../shared/src';

export const getCurrencyParamsSchema = Joi.object<GetCurrencyRequestParams>({
  currencyId: Joi.string()
    .valid(...Object.values(CurrencyId))
    .required()
});
