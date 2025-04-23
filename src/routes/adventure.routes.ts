import { Router } from 'express';

import { AdventureController } from '../controllers/adventure.controller';
import { validateRequest } from '../middleware/validate';
import {
  getAdventureParamsSchema,
  listAdventuresQuerySchema
} from '../joiSchemas/adventureSchema';

export const adventuresRouter = Router();
const adventureController = new AdventureController();

adventuresRouter.get(
  '',
  validateRequest(listAdventuresQuerySchema, 'query'),
  adventureController.list.bind(adventureController)
);

adventuresRouter.get(
  '/:adventureId',
  validateRequest(getAdventureParamsSchema, 'params'),
  adventureController.getOneById.bind(adventureController)
);
