import { Adventure } from '../../../shared/src';

export const ADVENTURES_MOCK: Adventure[] = [
  {
    adventureId: 1,
    level: 5,
    name: 'Adventure 1',
    rewards: [
      {
        rewardId: 5,
        amount: 1
      }
    ],
    timeInSeconds: 500
  },
  {
    adventureId: 2,
    level: 5,
    name: 'Adventure 2',
    rewards: [
      {
        rewardId: 2,
        amount: 1
      }
    ],
    timeInSeconds: 500,
    enemyIds: [4]
  },
  {
    adventureId: 3,
    level: 5,
    name: 'Adventure 3',
    rewards: [
      {
        rewardId: 4,
        amount: 1
      }
    ],
    timeInSeconds: 500,
    requiredLevel: 10
  }
];