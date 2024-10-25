import { Router } from 'express';

import { CharacterController } from '../controllers/character.controller';

export class CharacterRoutes {
  private router: Router;
  private characterController: CharacterController;

  constructor() {
    this.router = Router();
    this.characterController = new CharacterController();

    this.router.get(
      '',
      this.characterController.getAll.bind(this.characterController)
    );

    this.router.get(
      '/:characterId',
      this.characterController.getOneById.bind(this.characterController)
    );

    this.router.post(
      '',
      this.characterController.createCharacter.bind(this.characterController)
    );

    this.router.patch(
      '/:characterId',
      this.characterController.patch.bind(this.characterController)
    );

    this.router.patch(
      '/:characterId/increase-experience',
      this.characterController.increaseExperience.bind(this.characterController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
