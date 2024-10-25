import { Router } from 'express';
import { CurrencyController } from '../controllers/currencyController';

export const currenciesRouter = Router();
const currencyController = new CurrencyController();

currenciesRouter.get('', (req, res) =>
  currencyController.listCurrencies(req, res)
);

currenciesRouter.get('/:id', (req, res) =>
  currencyController.getCurrency(req, res)
);
