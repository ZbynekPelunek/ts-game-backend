import express, { Request, Response } from 'express';
import axios from 'axios';

import {
  CharacterAttributeFrontendPopulated,
  CharacterBackend,
  Request_CharacterAttribute_GET_all_query,
  Request_Result_POST_body,
  Response_CharacterAttribute_GET_all,
  Response_Result_POST,
  ResultCombat,
} from '../../../shared/src';
import { AdventureModel } from '../schema/adventure.schema';
import { CharacterModel } from '../schema/character.schema';
import { ResultModel } from '../schema/result.schema';
import { Combat } from '../engine/combat';
import { PUBLIC_ROUTES } from '../server';
import { EnemyModel } from '../schema/enemy.schema';

export const resultsRouter = express.Router();

resultsRouter.post(
  '',
  async (
    req: Request<{}, {}, Request_Result_POST_body>,
    res: Response<Response_Result_POST>
  ) => {
    const { characterId, adventureId } = req.body;
    const currentDateMs = Date.now();

    const character: CharacterBackend | null =
      await CharacterModel.findById(characterId);

    if (!character) {
      return res.status(404).json({
        success: false,
        error: `Character with id '${characterId}' not found.`,
      });
    }

    const adventure = await AdventureModel.findById(adventureId);

    if (!adventure) {
      return res.status(404).json({
        success: false,
        error: `Adventure with id '${adventureId}' not found.`,
      });
    }

    const timeFinishMs = currentDateMs + adventure.timeInSeconds * 1000;

    const timeFinish = new Date(timeFinishMs).toISOString();
    const timeStart = new Date(currentDateMs).toISOString();

    const result = new ResultModel({
      adventureId,
      characterId,
      combat: null,
      timeFinish,
      timeStart,
    });

    if (adventure.enemyIds?.length) {
      const charAttQueryString: Request_CharacterAttribute_GET_all_query = {
        populateAttribute: true,
      };
      const characterAttributesRes =
        await axios.get<Response_CharacterAttribute_GET_all>(
          `http://localhost:3000${PUBLIC_ROUTES.CharacterAttributes}`,
          { params: charAttQueryString }
        );

      if (!characterAttributesRes.data.success) {
        return res.status(500).json({
          success: false,
          error: `Character attributes error`,
        });
      }

      const characterAttributes = characterAttributesRes.data
        .characterAttributes as CharacterAttributeFrontendPopulated[];
      const enemy = await EnemyModel.findById(adventure.enemyIds[0]);

      if (!enemy) {
        return res.status(404).json({
          success: false,
          error: `Enemy with id '${adventure.enemyIds[0]}' not found.`,
        });
      }

      const combat = new Combat();
      combat.start(character.name, characterAttributes, enemy);

      const combatResult: ResultCombat = {
        log: combat.log,
        playerWon: combat.playerWon,
      };

      result.combat = combatResult;
    }

    const resultdbRes = await result.save();
    console.log('resultdbRes: ', resultdbRes);

    return res.status(201).json({
      success: true,
      result: { resultId: result.id, timeStart, timeFinish },
    });
  }
);

// resultsRouter.get('/:resultId', (req: Request, res: Response) => {
//   const { resultId } = req.params;

//   const result = adventureResults[adventureResults.findIndex((r) => r.resultId === resultId)];
//   if (!result) {
//     throw new NotFoundError(`Result with id ${resultId} not found`);
//   }

//   if (!adventureResults.find((a) => a.adventureId === result.adventureId)) {
//     throw new NotFoundError(`Adventure with id ${result.adventureId} in results not found`);
//   }

//   // get character from db with characterId from result
//   const character = testCharacter;
//   const adventure = character.adventures.find(a => a.adventureId === result.adventureId);
//   if (!adventure) {
//     return res.status(404).json({
//       error: 'Not Found',
//       message: `Adventure with id ${result.adventureId} not found in In Progress adventures`
//     })
//   }

//   if (result.playerWon) {
//     character.addExperience(adventure.reward.experience);
//     if (adventure.reward.items) {
//       adventure.reward.items.forEach((r) => {
//         character.addItemToInventory(r);
//       })
//     }
//   }

//   adventure.adventureState = AdventureState.IDLE; // should be AdventureState.COMPLETE

//   return res.status(200).json({ result });
// })
