import { Router } from 'express';

import { CharacterEquipmentController } from '../controllers/characterEquipmentController';
import {
  CharacterEquipmentPatchActions,
  CharacterEquipmentPostActions,
} from '../../../shared/src';

export const characterEquipmentRouter = Router();
const characterEquipmentController = new CharacterEquipmentController();

characterEquipmentRouter.get(
  '',
  characterEquipmentController.listCharacterEquipment.bind(
    characterEquipmentController
  )
);

characterEquipmentRouter.post(
  '',
  characterEquipmentController.createCharacterEquipment.bind(
    characterEquipmentController
  )
);

characterEquipmentRouter.post(
  `/${CharacterEquipmentPostActions.EQUIP_ITEM}`,
  characterEquipmentController.equipItemFromInventory.bind(
    characterEquipmentController
  )
);

characterEquipmentRouter.patch(
  `/:characterEquipmentId/${CharacterEquipmentPatchActions.EQUIP_ITEM}`,
  characterEquipmentController.equipItem.bind(characterEquipmentController)
);

characterEquipmentRouter.patch(
  `/:characterEquipmentId/${CharacterEquipmentPatchActions.UNEQUIP_ITEM}`,
  characterEquipmentController.unequipItem.bind(characterEquipmentController)
);
