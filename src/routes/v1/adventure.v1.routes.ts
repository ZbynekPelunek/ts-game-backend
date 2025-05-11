import { Router } from 'express';

import { AdventureController } from '../../controllers/adventure.controller';
import {
  listAdventuresQuerySchema,
  getAdventureParamsSchema
} from '../../joiSchemas/adventure.schema';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';

export const adventuresV1Router = Router();
const adventureController = new AdventureController();

adventuresV1Router.get(
  '',
  authenticateJWT,
  validateRequest(listAdventuresQuerySchema, 'query'),
  adventureController.list.bind(adventureController)
);

adventuresV1Router.get(
  '/:adventureId',
  authenticateJWT,
  validateRequest(getAdventureParamsSchema, 'params'),
  adventureController.getOneById.bind(adventureController)
);
