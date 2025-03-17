import { Router } from 'express';

import { CharacterEquipmentController } from '../controllers/characterEquipmentController';
import {
  CharacterEquipmentPatchActions,
  CharacterEquipmentPostActions
} from '../../../shared/src';

export const characterEquipmentRouter = Router();
const characterEquipmentController = new CharacterEquipmentController();

characterEquipmentRouter.get(
  '',
  characterEquipmentController.list.bind(characterEquipmentController)
);

characterEquipmentRouter.post(
  '',
  characterEquipmentController.create.bind(characterEquipmentController)
);

characterEquipmentRouter.post(
  `/${CharacterEquipmentPostActions.EQUIP_ITEM}`,
  characterEquipmentController.equipItemFromInventory.bind(
    characterEquipmentController
  )
);

characterEquipmentRouter.patch(
  `/:characterEquipmentId/${CharacterEquipmentPatchActions.UNEQUIP_ITEM}`,
  characterEquipmentController.unequipItem.bind(characterEquipmentController)
);

characterEquipmentRouter.patch(
  `/:characterEquipmentId/${CharacterEquipmentPatchActions.SELL_ITEM}`,
  characterEquipmentController.sellItem.bind(characterEquipmentController)
);
