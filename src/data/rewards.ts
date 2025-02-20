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
  {
    _id: 4,
    experience: 40,
    items: [{ itemId: 2, amount: 1 }],
  },
  {
    _id: 5,
    experience: 50,
    items: [{ itemId: 3, amount: 1 }],
  },
  {
    _id: 6,
    experience: 60,
    items: [{ itemId: 4, amount: 1 }],
  },
  {
    _id: 7,
    experience: 70,
    items: [{ itemId: 5, amount: 1 }],
    currencies: [{ currencyId: CurrencyId.GOLD, amount: 12 }],
  },
];
