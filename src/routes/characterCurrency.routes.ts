import { Router } from 'express';

import { CharacterCurrencyController } from '../controllers/characterCurrency.controller';

export const characterCurrenciesRouter = Router();
const characterCurrencyController = new CharacterCurrencyController();

characterCurrenciesRouter.get(
  '',
  characterCurrencyController.list.bind(characterCurrencyController)
);

characterCurrenciesRouter.post(
  '',
  characterCurrencyController.create.bind(characterCurrencyController)
);

characterCurrenciesRouter.patch(
  '/:characterCurrencyId',
  characterCurrencyController.update.bind(characterCurrencyController)
);
