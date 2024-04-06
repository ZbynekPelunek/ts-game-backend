import { Adventure, AdventureTypes } from '../../../shared/src';

export const ADVENTURES_MOCK: Adventure[] = [
  {
    _id: 1,
    adventureLevel: 1,
    name: 'Adventure 1',
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 5,
        amount: 1,
      },
    ],
    timeInSeconds: 500,
  },
  {
    _id: 2,
    adventureLevel: 1,
    name: 'Adventure 2',
    type: AdventureTypes.COMMON,
    rewards: [
      {
        rewardId: 2,
        amount: 1,
      },
    ],
    timeInSeconds: 500,
    enemyIds: [4],
  },
  {
    _id: 3,
    adventureLevel: 2,
    name: 'Adventure 3',
    type: AdventureTypes.COMMON,
    rewards: [
      {
        rewardId: 4,
        amount: 1,
      },
    ],
    timeInSeconds: 500,
    requiredLevel: 10,
  },
  {
    _id: 4,
    adventureLevel: 2,
    name: 'Adventure 4',
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 5,
        amount: 1,
      },
    ],
    timeInSeconds: 500,
  },
  {
    _id: 5,
    adventureLevel: 3,
    name: 'Adventure 5',
    type: AdventureTypes.COMMON,
    rewards: [
      {
        rewardId: 2,
        amount: 1,
      },
    ],
    timeInSeconds: 500,
    enemyIds: [4],
  },
  {
    _id: 6,
    adventureLevel: 3,
    name: 'Adventure 6',
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 4,
        amount: 1,
      },
    ],
    timeInSeconds: 500,
    requiredLevel: 10,
  },
];
