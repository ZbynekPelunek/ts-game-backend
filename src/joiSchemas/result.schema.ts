import Joi from 'joi';
import {
  GetResultRequestParams,
  ListResultsRequestQuery,
  ResultState
} from '../../../shared/src';
import { validObjectIdCheck } from '../utils/joiCustomMethods';

export const listResultsQuerySchema = Joi.object<ListResultsRequestQuery>({
  limit: Joi.number(),
  characterId: Joi.string().custom(validObjectIdCheck),
  state: Joi.valid(...Object.values(ResultState))
});

export const getResultParamSchema = Joi.object<GetResultRequestParams>({
  resultId: Joi.string().custom(validObjectIdCheck)
});
