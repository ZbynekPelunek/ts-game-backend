import { Router } from 'express';

import { CharacterController } from '../controllers/character.controller';

export const charactersRouter = Router();
const characterController = new CharacterController();

charactersRouter.get('', characterController.getAll.bind(characterController));

charactersRouter.post('', characterController.post.bind(characterController));

charactersRouter.get(
  '/:characterId',
  characterController.getOneById.bind(characterController)
);
