import * as _ from 'lodash';

import {
  AdventureResult,
  AdventureState,
  AdventureTimer,
  CharacterBackend,
  IAdventure,
} from '../../../shared/src';
import { AttackerTarget } from '../interface/combat.interface';
import { adventureResults } from '../routes/results.router';
import { Combat } from './combat';

// export async function startAdventure(adventure: IAdventure, character: ICharacter): Promise<{ resultId: string; timeStarted: string; timeFinished: string; adventure: IAdventure }> {
//   const now = new Date();
//   const timeStarted = now.toISOString();
//   const timeFinished = new Date(now.getTime() + adventure.timeInSeconds * 1000).toISOString();
//   const timer: AdventureTimer = {
//     timeStarted: timeStarted,
//     timeFinished: timeFinished
//   }
//   adventure.adventureState = AdventureState.IN_PROGRESS;
//   adventure.timer = timer;

//   // COMBAT HERE
//   const enemy: AttackerTarget = {
//     name: 'Some Enemy',
//     health: 10,
//     damage: 1
//   }
//   // const characterStats = character.stats.reduce((obj: { [key: string]: number }, item) => ({ ...obj, [item.statName]: item.statBasicValue + item.statAddedValue }), {});

//   const attackingCharacter: AttackerTarget = {
//     name: character.name,
//     damage: _.round(((character.attributes.Min_Damage.totalValue + character.attributes.Max_Damage.totalValue) / 2), 2),
//     health: character.attributes.Health.totalValue
//   }
//   const combat = new Combat;
//   combat.attack(attackingCharacter, enemy, true);

//   const resultId = new Date().getTime().toString();

//   const result: AdventureResult = {
//     characterId: character._id as string,
//     resultId,
//     adventureId: adventure.adventureId,
//     playerWon: combat.playerWon,
//     log: combat.log
//   }

//   adventure.resultId = resultId;

//   adventureResults.push(result);

//   return { resultId: result.resultId, timeStarted: timeStarted, timeFinished: timeFinished, adventure };
// }