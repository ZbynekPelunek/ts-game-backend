import { Router } from 'express';

import { CharacterAttributeController } from '../../controllers/characterAttribute.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { createCharacterAttributeBodySchema } from '../../joiSchemas/characterAttribute.schema';

export const characterAttributesInternalRouter = Router();
const characterAttributesController = new CharacterAttributeController();

characterAttributesInternalRouter.post(
  '',
  validateRequest(createCharacterAttributeBodySchema, 'body'),
  characterAttributesController.create.bind(characterAttributesController)
);
