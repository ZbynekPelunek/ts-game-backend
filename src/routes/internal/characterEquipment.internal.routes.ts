import { Router } from 'express';

import { CharacterEquipmentController } from '../../controllers/characterEquipment.controller';

export const characterEquipmentInternalRouter = Router();
const characterEquipmentController = new CharacterEquipmentController();

characterEquipmentInternalRouter.post(
  '',
  characterEquipmentController.create.bind(characterEquipmentController)
);
