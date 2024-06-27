import { Router } from 'express';

import { CharacterEquipmentController } from '../controllers/characterEquipment.controller';
import { CharacterEquipmentPatchActions } from '../../../shared/src';

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

characterEquipmentRouter.patch(
  `/:characterEquipmentId/${CharacterEquipmentPatchActions.EQUIP_ITEM}`,
  characterEquipmentController.equipItem.bind(characterEquipmentController)
);

characterEquipmentRouter.patch(
  `/:characterEquipmentId/${CharacterEquipmentPatchActions.UNEQUIP_ITEM}`,
  characterEquipmentController.unequipItem.bind(characterEquipmentController)
);
