import axios from 'axios';
import { Request, Response } from 'express';

import {
  Request_Result_POST_body,
  Response_Result_POST,
  CharacterBackend,
  Request_CharacterAttribute_GET_all_query,
  Response_CharacterAttribute_GET_all,
  CharacterAttributeFrontendPopulated,
  ResultCombat,
} from '../../../shared/src';
import { Combat } from '../engine/combat';
import { AdventureModel } from '../models/adventure.model';
import { CharacterModel } from '../models/character.model';
import { EnemyModel } from '../models/enemy.model';
import { ResultModel } from '../models/result.model';
import { FULL_PUBLIC_ROUTES } from '../services/api.service';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class ResultController {
  async post(
    req: Request<{}, {}, Request_Result_POST_body>,
    res: Response<Response_Result_POST>
  ) {
    try {
      const { characterId, adventureId } = req.body;
      const currentDateMs = Date.now();

      const character: CharacterBackend | null =
        await CharacterModel.findById(characterId);

      if (!character) {
        throw new CustomError(
          `Character with id '${characterId}' not found.`,
          404
        );
      }

      const adventure = await AdventureModel.findById(adventureId);

      if (!adventure) {
        throw new CustomError(
          `Adventure with id '${adventureId}' not found.`,
          404
        );
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
            `${FULL_PUBLIC_ROUTES.CharacterAttributes}`,
            { params: charAttQueryString }
          );

        if (!characterAttributesRes.data.success) {
          throw new CustomError(`Character attributes error`, 500);
        }

        const characterAttributes = characterAttributesRes.data
          .characterAttributes as CharacterAttributeFrontendPopulated[];
        const enemy = await EnemyModel.findById(adventure.enemyIds[0]);

        if (!enemy) {
          throw new CustomError(
            `Enemy with id '${adventure.enemyIds[0]}' not found.`,
            500
          );
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
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
