import { Router } from 'express';

import { AttributeController } from '../controllers/attribute.controller';

export const attributesRouter = Router();
const attributeController = new AttributeController();

attributesRouter.get('', attributeController.list);

attributesRouter.get('/:attributeId', attributeController.getOneById);
