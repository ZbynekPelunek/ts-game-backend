import { Router } from 'express';

import { CharacterAttributeController } from '../controllers/characterAttributeController';
import { CreateCharacterAttributeCommand } from '../commands/characterAttribute/create';
import { ListCharacterAttributeQuery } from '../queries/characterAttribute/listCharacterAttribute';
import { CharacterAttributeService } from '../services/characterAttributeService';
import { CreateBundleCharacterAttributeCommand } from '../commands/characterAttribute/createBundle';

export const characterAttributesRouter = Router();

const characterAttributeService = new CharacterAttributeService();
const listQuery = new ListCharacterAttributeQuery(characterAttributeService);
const createCommand = new CreateCharacterAttributeCommand(
  characterAttributeService
);
const createBundleCommand = new CreateBundleCharacterAttributeCommand(
  characterAttributeService
);
const characterAttributesController = new CharacterAttributeController(
  {
    listCharacterAttributeQuery: listQuery,
  },
  {
    createBundleCharacterAttributeCommand: createBundleCommand,
    createCharacterAttributeCommand: createCommand,
  }
);

characterAttributesRouter.get(
  '',
  characterAttributesController.list.bind(characterAttributesController)
);

characterAttributesRouter.post(
  '',
  characterAttributesController.create.bind(characterAttributesController)
);

characterAttributesRouter.post(
  '/bundle',
  characterAttributesController.createBundle.bind(characterAttributesController)
);
