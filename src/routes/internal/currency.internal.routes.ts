import { Router } from 'express';
import { CurrencyController } from '../../controllers/currency.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { getCurrencyParamsSchema } from '../../joiSchemas/currency.schema';

export const currenciesInternalRouter = Router();
const currencyController = new CurrencyController();

currenciesInternalRouter.get(
  '',
  currencyController.listCurrencies.bind(currencyController)
);

currenciesInternalRouter.get(
  '/:currencyId',
  validateRequest(getCurrencyParamsSchema, 'params'),
  currencyController.getCurrency.bind(currencyController)
);
