import { CurrencyId } from '../../../shared/src/interface/currency/currency';
import { CustomError } from '../middleware/errorHandler';
import { CurrencyModel } from '../models/currency.model';

export class CurrencyService {
  async list() {
    return CurrencyModel.find().lean();
  }

  async getById(currencyId: CurrencyId) {
    return this.currencyIdExists(currencyId);
  }

  private async currencyIdExists(currencyId: CurrencyId, select = '_id') {
    const currency = await CurrencyModel.findById(currencyId, undefined, {
      select
    }).lean();

    if (!currency) {
      throw new CustomError(`Currency with id ${currencyId} not found.`, 404);
    }
    return currency;
  }
}
