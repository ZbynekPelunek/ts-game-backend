import { Router } from 'express';

import { CharacterAttributeController } from '../../controllers/characterAttribute.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { listCharacterAttributesQuerySchema } from '../../joiSchemas/characterAttribute.schema';
import { authenticateJWT } from '../../middleware/auth.middleware';

export const characterAttributesV1Router = Router();
const characterAttributesController = new CharacterAttributeController();

characterAttributesV1Router.get(
  '',
  authenticateJWT,
  validateRequest(listCharacterAttributesQuerySchema, 'query'),
  characterAttributesController.list.bind(characterAttributesController)
);
