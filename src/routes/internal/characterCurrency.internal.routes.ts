import { Router } from 'express';

import { CharacterCurrencyController } from '../../controllers/characterCurrency.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { createCharacterCurrencyBodySchema } from '../../joiSchemas/characterCurrency.schema';

export const characterCurrenciesInternalRouter = Router();
const characterCurrencyController = new CharacterCurrencyController();

characterCurrenciesInternalRouter.post(
  '',
  validateRequest(createCharacterCurrencyBodySchema, 'body'),
  characterCurrencyController.create.bind(characterCurrencyController)
);
