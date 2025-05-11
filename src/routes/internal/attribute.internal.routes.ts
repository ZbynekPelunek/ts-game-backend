import { Router } from 'express';

import { AttributeController } from '../../controllers/attribute.controller';
import { getAttributeParamsSchema } from '../../joiSchemas/attribute.schema';
import { validateRequest } from '../../middleware/validate.middleware';

export const attributesInternalRouter = Router();
const attributeController = new AttributeController();

attributesInternalRouter.get(
  '',
  attributeController.list.bind(attributeController)
);

attributesInternalRouter.get(
  '/:attributeId',
  validateRequest(getAttributeParamsSchema, 'params'),
  attributeController.getOneById.bind(attributeController)
);
