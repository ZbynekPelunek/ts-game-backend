import { Router } from 'express';

import { CharacterController } from '../controllers/character.controller';

export const charactersRouter = Router();
const characterController = new CharacterController();

charactersRouter.get('', characterController.getAll.bind(characterController));

charactersRouter.post(
  '',
  characterController.createCharacter.bind(characterController)
);

charactersRouter.get(
  '/:characterId',
  characterController.getOneById.bind(characterController)
);

// TODO: make router into a class
/* export class CharacterRoutes {
  private router: Router;
  private characterController: CharacterController;

  constructor(apiService: ApiService) {
    this.router = Router();
    this.characterController = new CharacterController(apiService);

    this.router.get(
      '',
      this.characterController.getAll.bind(this.characterController)
    );

    this.router.get(
      '/:characterId',
      this.characterController.getOneById.bind(this.characterController)
    );

    this.router.post(
      '/characters',
      this.characterController.createCharacter.bind(this.characterController)
    );
    // Add other routes as needed
  }

  public getRouter(): Router {
    return this.router;
  }
} */
