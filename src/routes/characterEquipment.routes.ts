import { Router } from 'express';

import { CharacterEquipmentController } from '../controllers/characterEquipment.controller';

export const characterEquipmentRouter = Router();
const characterEquipmentController = new CharacterEquipmentController();

characterEquipmentRouter.get(
  '',
  characterEquipmentController.getAll.bind(characterEquipmentController)
);

characterEquipmentRouter.post(
  '',
  characterEquipmentController.post.bind(characterEquipmentController)
);
