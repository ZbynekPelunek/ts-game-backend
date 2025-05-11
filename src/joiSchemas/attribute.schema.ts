import Joi from 'joi';

import { GetAttributeRequestParams } from '../../../shared/src';
import { validObjectIdCheck } from '../utils/joiCustomMethods';

export const getAttributeParamsSchema = Joi.object<GetAttributeRequestParams>({
  attributeId: Joi.string().required().custom(validObjectIdCheck)
});
