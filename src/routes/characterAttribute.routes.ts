import { Router } from 'express';

import { CharacterAttributeController } from '../controllers/characterAttribute.controller';

export const characterAttributesRouter = Router();
const characterAttributesController = new CharacterAttributeController();

characterAttributesRouter.get(
  '',
  characterAttributesController.getAll.bind(characterAttributesController)
);

characterAttributesRouter.post(
  '',
  characterAttributesController.post.bind(characterAttributesController)
);
