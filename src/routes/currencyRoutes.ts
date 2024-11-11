import { Router } from 'express';
import { CurrencyController } from '../controllers/currencyController';

export const currenciesRouter = Router();
const currencyController = new CurrencyController();

currenciesRouter.get(
  '',
  currencyController.listCurrencies.bind(currencyController)
);

currenciesRouter.get(
  '/:id',
  currencyController.getCurrency.bind(currencyController)
);
