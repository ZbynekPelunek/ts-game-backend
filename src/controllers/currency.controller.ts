import { Request, Response } from 'express-serve-static-core';

import {
  GetCurrencyRequestParams,
  GetCurrencyResponse,
  ListCurrenciesResponse
} from '../../../shared/src';
import { CurrencyService } from '../services/currency.service';

export class CurrencyController {
  private currencyService: CurrencyService;

  constructor() {
    this.currencyService = new CurrencyService();
  }

  async listCurrencies(_req: Request, res: Response<ListCurrenciesResponse>) {
    const currencies = await this.currencyService.list();

    res.status(200).json({
      success: true,
      currencies: currencies.map((cur) => {
        return {
          _id: cur._id,
          label: cur.label,
          cap: cur.cap,
          desc: cur.desc
        };
      })
    });
  }

  async getCurrency(
    req: Request<GetCurrencyRequestParams>,
    res: Response<GetCurrencyResponse>
  ) {
    const { currencyId } = req.params;

    const currency = await this.currencyService.getById(currencyId);

    res.status(200).json({
      success: true,
      currency: {
        _id: currency._id
      }
    });
  }
}
