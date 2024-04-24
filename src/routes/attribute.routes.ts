import { Router } from 'express';

import { AttributeController } from '../controllers/attribute.controller';

export const attributesRouter = Router();
const attributeController = new AttributeController();

attributesRouter.get('', attributeController.getAll);

attributesRouter.get('/:attributeId', attributeController.getOneById);
