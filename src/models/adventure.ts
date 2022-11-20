import { AdventureState, IAdventure } from '../../../shared/src';

export class Adventure {
  static create(adventure: IAdventure): IAdventure {
    return {
      adventureId: adventure.adventureId,
      name: adventure.name,
      level: adventure.level,
      timeInSeconds: adventure.timeInSeconds,
      requiredLevel: adventure.requiredLevel || 1,
      adventureState: adventure.adventureState || AdventureState.IDLE,
      reward: {
        experience: adventure.reward?.experience || 0,
        items: adventure.reward?.items || [],
        currencies: adventure.reward?.currencies
      }
    }
  }
}