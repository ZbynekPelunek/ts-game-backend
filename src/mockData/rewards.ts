import { Reward } from '../../../shared/src';

export const REWARDS_MOCK: Reward[] = [
  {
    _id: 1,
    experience: 5,
  },
  {
    _id: 2,
    currencies: [
      {
        currencyId: 1,
        amount: 5,
      },
    ],
  },
  {
    _id: 3,
    items: [
      {
        itemId: 6,
        amount: 2,
      },
    ],
  },
];
