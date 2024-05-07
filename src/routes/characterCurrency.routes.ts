import { Router } from 'express';

import { CharacterCurrencyController } from '../controllers/characterCurrency.controller';

export const characterCurrenciesRouter = Router();
const characterCurrencyController = new CharacterCurrencyController();

characterCurrenciesRouter.get(
  '',
  characterCurrencyController.getAll.bind(characterCurrencyController)
);

characterCurrenciesRouter.post(
  '',
  characterCurrencyController.post.bind(characterCurrencyController)
);

characterCurrenciesRouter.patch(
  '/:characterCurrencyId',
  characterCurrencyController.patch.bind(characterCurrencyController)
);
