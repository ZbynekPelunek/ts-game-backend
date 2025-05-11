import { Router } from 'express';

import { CharacterCurrencyController } from '../../controllers/characterCurrency.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import {
  listCharacterCurrenciesQuerySchema,
  updateCharacterCurrencyBodySchema,
  updateCharacterCurrencyParamsSchema
} from '../../joiSchemas/characterCurrency.schema';
import { authenticateJWT } from '../../middleware/auth.middleware';

export const characterCurrenciesV1Router = Router();
const characterCurrencyController = new CharacterCurrencyController();

characterCurrenciesV1Router.get(
  '',
  authenticateJWT,
  validateRequest(listCharacterCurrenciesQuerySchema, 'query'),
  characterCurrencyController.list.bind(characterCurrencyController)
);

characterCurrenciesV1Router.patch(
  '/:characterCurrencyId',
  authenticateJWT,
  validateRequest(updateCharacterCurrencyParamsSchema, 'params'),
  validateRequest(updateCharacterCurrencyBodySchema, 'body'),
  characterCurrencyController.update.bind(characterCurrencyController)
);
