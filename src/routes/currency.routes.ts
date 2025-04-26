import { Router } from 'express';
import { CurrencyController } from '../controllers/currency.controller';
import { validateRequest } from '../middleware/validate';
import { getCurrencyParamsSchema } from '../joiSchemas/currency.schema';

export const currenciesRouter = Router();
const currencyController = new CurrencyController();

currenciesRouter.get(
  '',
  currencyController.listCurrencies.bind(currencyController)
);

currenciesRouter.get(
  '/:currencyId',
  validateRequest(getCurrencyParamsSchema, 'params'),
  currencyController.getCurrency.bind(currencyController)
);
