import { CurrencyModel } from '../models/currency';
import { GetCurrency } from '../queries/getCurrency';
import { ListCurrencies } from '../queries/listCurrencies';

export class QueryHandler {
  async handle(query: any): Promise<any> {
    if (query instanceof GetCurrency) {
      return await CurrencyModel.findById(query.id).lean();
    }

    if (query instanceof ListCurrencies) {
      return await CurrencyModel.find().lean();
    }

    throw new Error('Unknown query');
  }
}
