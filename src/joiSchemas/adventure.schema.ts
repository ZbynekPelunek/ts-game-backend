import Joi from 'joi';

import {
  AdventureTypes,
  GetAdventureRequestParams,
  ListAdventuresRequestQuery
} from '../../../shared/src';

export const listAdventuresQuerySchema = Joi.object<ListAdventuresRequestQuery>(
  {
    adventureId: Joi.number(),
    adventureLevel: Joi.number(),
    limit: Joi.number(),
    populateReward: Joi.boolean(),
    type: Joi.string().valid(...Object.values(AdventureTypes))
  }
);

export const getAdventureParamsSchema = Joi.object<GetAdventureRequestParams>({
  adventureId: Joi.number().required()
});
