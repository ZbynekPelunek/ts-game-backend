import { Request, Response } from 'express';

import { QueryHandler } from '../services/queryHandler';
import { GetCurrency } from '../queries/getCurrency';
import { errorHandler } from '../middleware/errorHandler';
import { ListCurrencies } from '../queries/listCurrencies';

const queryHandler = new QueryHandler();

export class CurrencyController {
  async listCurrencies(req: Request, res: Response) {
    try {
      const query = new ListCurrencies();

      const result = await queryHandler.handle(query);

      return res.status(200).json(result);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getCurrency(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const query = new GetCurrency(id);

      const result = await queryHandler.handle(query);

      return res.status(200).json(result);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
