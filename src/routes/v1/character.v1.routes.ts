import { Router } from 'express';

import { CharacterController } from '../../controllers/character.controller';
import {
  getCharacterParamsSchema,
  createCharacterBodySchema,
  updateCharacterParamsSchema,
  updateCharacterBodySchema,
  deleteCharacterParamsSchema
} from '../../joiSchemas/character.schema';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';

export const characterV1Router = Router();
const characterController = new CharacterController();

characterV1Router.get(
  '',
  authenticateJWT,
  characterController.list.bind(characterController)
);
characterV1Router.get(
  '/:characterId',
  authenticateJWT,
  validateRequest(getCharacterParamsSchema, 'params'),
  characterController.getOneById.bind(characterController)
);

characterV1Router.post(
  '',
  authenticateJWT,
  validateRequest(createCharacterBodySchema, 'body'),
  characterController.create.bind(characterController)
);

characterV1Router.patch(
  '/:characterId',
  authenticateJWT,
  validateRequest(updateCharacterParamsSchema, 'params'),
  validateRequest(updateCharacterBodySchema, 'body'),
  characterController.patch.bind(characterController)
);

characterV1Router.delete(
  '/:characterId',
  authenticateJWT,
  validateRequest(deleteCharacterParamsSchema, 'params'),
  characterController.delete.bind(characterController)
);
