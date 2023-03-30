import { Currencies, Currency, CurrencyId } from '../../../shared/src';

export const defaultCharacterCurrencies: Currency[] = [
  {
    currencyId: CurrencyId.GOLD,
    name: 'gold',
    label: 'Gold',
    amount: 1000,
    cap: 100000
  },
  {
    currencyId: CurrencyId.CHEATING_CURRENCY,
    name: 'cc',
    label: 'Cheating Currency',
    amount: 1000,
    cap: 1000000
  }
]