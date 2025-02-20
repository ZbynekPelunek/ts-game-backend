import { Adventure, AdventureTypes } from '../../../shared/src';

export const BEGINNER_ADVENTURES: Adventure[] = [
  {
    _id: 1,
    name: 'Adventure - XP',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 1,
        amount: 1,
      },
    ],
    timeInSeconds: 2,
  },
  {
    _id: 2,
    name: 'Adventure - XP, Common Item',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 2,
        amount: 1,
      },
    ],
    timeInSeconds: 2,
  },
  {
    _id: 3,
    name: 'Adventure - XP, Gold',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 3,
        amount: 1,
      },
    ],
    timeInSeconds: 2,
  },
  {
    _id: 4,
    name: 'Adventure - XP, Uncommon Item',
    adventureLevel: 1,
    type: AdventureTypes.COMMON,
    rewards: [
      {
        rewardId: 4,
        amount: 1,
      },
    ],
    timeInSeconds: 2,
  },
  {
    _id: 5,
    name: 'Adventure - XP, Rare Item',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 5,
        amount: 1,
      },
    ],
    timeInSeconds: 2,
  },
  {
    _id: 6,
    name: 'Adventure - XP. Epic Item',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 6,
        amount: 1,
      },
    ],
    timeInSeconds: 2,
  },
  {
    _id: 7,
    name: 'Adventure - XP. Legendary Item, Gold',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 7,
        amount: 1,
      },
    ],
    timeInSeconds: 2,
  },
  {
    _id: 8,
    name: 'Short Adventure',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 7,
        amount: 1,
      },
    ],
    timeInSeconds: 2,
  },
  {
    _id: 9,
    name: 'Medium Adventure',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 7,
        amount: 1,
      },
    ],
    timeInSeconds: 20,
  },
  {
    _id: 10,
    name: 'Long Adventure',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 7,
        amount: 1,
      },
    ],
    timeInSeconds: 60,
  },
  {
    _id: 11,
    name: 'Very Long Adventure',
    adventureLevel: 1,
    type: AdventureTypes.TUTORIAL,
    rewards: [
      {
        rewardId: 7,
        amount: 1,
      },
    ],
    timeInSeconds: 300,
  },
];
