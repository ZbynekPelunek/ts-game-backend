import { Router } from 'express';

import { AdventureController } from '../controllers/adventure.controller';

export const adventuresRouter = Router();
const adventureController = new AdventureController();

adventuresRouter.get('', adventureController.list);

adventuresRouter.get('/:adventureId', adventureController.getOneById);
