import { Router } from 'express';

import { CharacterEquipmentController } from '../../controllers/characterEquipment.controller';
import {
  CharacterEquipmentPatchActions,
  CharacterEquipmentPostActions
} from '../../../../shared/src';
import { authenticateJWT } from '../../middleware/auth.middleware';

export const characterEquipmentV1Router = Router();
const characterEquipmentController = new CharacterEquipmentController();

characterEquipmentV1Router.get(
  '',
  authenticateJWT,
  characterEquipmentController.list.bind(characterEquipmentController)
);

characterEquipmentV1Router.post(
  `/${CharacterEquipmentPostActions.EQUIP_ITEM}`,
  authenticateJWT,
  characterEquipmentController.equipItemFromInventory.bind(
    characterEquipmentController
  )
);

characterEquipmentV1Router.patch(
  `/:characterEquipmentId/${CharacterEquipmentPatchActions.UNEQUIP_ITEM}`,
  authenticateJWT,
  characterEquipmentController.unequipItem.bind(characterEquipmentController)
);

characterEquipmentV1Router.patch(
  `/:characterEquipmentId/${CharacterEquipmentPatchActions.SELL_ITEM}`,
  authenticateJWT,
  characterEquipmentController.sellItem.bind(characterEquipmentController)
);
