import { Currency, CurrencyId } from '../../../shared/src';

export const defaultCurrencies: Currency[] = [
  {
    _id: CurrencyId.GOLD,
    name: 'GOLD',
    label: 'Gold',
    cap: 100000,
    desc: 'Basic currency for everything',
  },
  {
    _id: CurrencyId.CHEATING_CURRENCY,
    name: 'CHEATING_CURRENCY',
    label: 'Cheating Currency',
  },
];
