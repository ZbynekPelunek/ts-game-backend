import { Adventure, AdventureTypes } from '../../../shared/src';

export const BEGINNER_ADVENTURES: Adventure[] = [
  {
    _id: 1,
    name: 'Beginner Adventure 1 (PLACEHOLDER)',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 0,
        amount: 1,
      },
    ],
    timeInSeconds: 2,
  },
  {
    _id: 2,
    name: 'Beginner Adventure 2 (PLACEHOLDER)',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 1,
        amount: 1,
      },
    ],
    timeInSeconds: 3,
  },
  {
    _id: 3,
    name: 'Beginner Adventure 3 (PLACEHOLDER)',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 1,
        amount: 1,
      },
    ],
    timeInSeconds: 4,
  },
  {
    _id: 4,
    name: 'Beginner Adventure 4 (PLACEHOLDER)',
    adventureLevel: 1,
    type: AdventureTypes.COMMON,
    rewards: [
      {
        rewardId: 1,
        amount: 1,
      },
    ],
    timeInSeconds: 5,
  },
];
