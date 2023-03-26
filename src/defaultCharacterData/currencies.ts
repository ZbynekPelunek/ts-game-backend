import { Currencies, Currency } from '../../../shared/src';

// export const defaultCharacterCurrencies: Currencies = {
//   gold: '1000',
//   cheating_currency: '1000'
// }

export const defaultCharacterCurrencies2: Currency[] = [
  {
    currencyId: 1,
    name: 'gold',
    label: 'Gold',
    amount: 1000,
    cap: 100000
  },
  {
    currencyId: 2,
    name: 'cc',
    label: 'Cheating Currency',
    amount: 1000,
    cap: 1000000
  }
]