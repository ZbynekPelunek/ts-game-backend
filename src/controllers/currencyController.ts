import { Request, Response } from 'express';

import { QueryHandler } from '../services/queryHandler';
import { GetCurrency } from '../queries/currency/getCurrency';
import { errorHandler } from '../middleware/errorHandler';
import { ListCurrencies } from '../queries/currency/listCurrencies';

export class CurrencyController {
  private queryHandler: QueryHandler;

  constructor() {
    this.queryHandler = new QueryHandler();
  }

  async listCurrencies(req: Request, res: Response) {
    try {
      const query = new ListCurrencies();

      const result = await this.queryHandler.handle(query);

      return res.status(200).json(result);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getCurrency(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const query = new GetCurrency(id);

      const result = await this.queryHandler.handle(query);

      return res.status(200).json(result);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
