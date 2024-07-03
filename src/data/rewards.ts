import { CurrencyId, Reward } from '../../../shared/src';

export const REWARDS: Reward[] = [
  {
    _id: 1,
    experience: 10,
  },
  {
    _id: 2,
    experience: 20,
    items: [{ itemId: 1, amount: 1 }],
  },
  {
    _id: 3,
    experience: 30,
    currencies: [{ currencyId: CurrencyId.GOLD, amount: 12 }],
  },
];
