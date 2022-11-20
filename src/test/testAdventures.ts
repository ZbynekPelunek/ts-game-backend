import { AdventureState, IAdventure } from '../../../shared/src/interface/adventures.interface';
import { Adventure } from '../models/adventure';
import { testEquipmentArr } from './testItems';

export const allAdventures: IAdventure[] = [
  Adventure.create({
    adventureId: '1',
    name: 'Adventure 1',
    level: 1,
    timeInSeconds: 5,
    reward: {
      experience: 100,
      items: [testEquipmentArr[4]],
      currencies: {
        gold: '1',
        cheating_currency: '1'
      }
    },
    adventureState: AdventureState.IDLE
  }),
  Adventure.create({
    adventureId: '2',
    name: 'Adventure 2',
    level: 2,
    timeInSeconds: 4,
    reward: {
      experience: 250,
      items: [testEquipmentArr[1], testEquipmentArr[2]],
      currencies: {
        gold: '2',
        cheating_currency: '2'
      }
    },
    adventureState: AdventureState.IDLE
  }),
  Adventure.create({
    adventureId: '3',
    name: 'Adventure 3',
    level: 3,
    timeInSeconds: 3,
    requiredLevel: 2,
    reward: {
      experience: 350
    },
    adventureState: AdventureState.IDLE
  }),
  Adventure.create({
    adventureId: '4',
    name: 'Adventure 4',
    level: 15,
    timeInSeconds: 30,
    requiredLevel: 10,
    reward: {
      experience: 5350
    },
    adventureState: AdventureState.IDLE
  }),
  Adventure.create({
    adventureId: '5',
    name: 'Long Adventure',
    level: 1,
    timeInSeconds: 60,
    reward: {
      experience: 5350
    },
    adventureState: AdventureState.IDLE
  })
];

export const characterAvailableAdventures: IAdventure[] = [
  allAdventures[0],
  allAdventures[1],
  allAdventures[2],
  allAdventures[4]
]