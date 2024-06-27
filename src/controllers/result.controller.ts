import { Request, Response } from 'express';

import {
  Request_Result_POST_body,
  Response_Result_POST,
  Request_CharacterAttribute_GET_all_query,
  Response_CharacterAttribute_GET_all,
  CharacterAttributeFrontendPopulated,
  ResultCombat,
  Request_Result_GET_all_query,
  Response_Result_GET_all,
  ResultBackend,
  ResultFrontend,
  Response_Result_GET_one,
  Request_Result_GET_one_params,
  Response_Character_GET_one,
  Response_Adventure_GET_one,
} from '../../../shared/src';
import { Combat } from '../engine/combat';
import { EnemyModel } from '../models/enemy.model';
import { ResultModel } from '../models/result.model';
import { ApiService, PUBLIC_ROUTES } from '../services/api.service';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class ResultController {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  async getAll(
    req: Request<{}, {}, {}, Request_Result_GET_all_query>,
    res: Response<Response_Result_GET_all>
  ) {
    try {
      const { characterId, limit } = req.query;

      const query = ResultModel.find().lean();

      if (characterId) query.where({ characterId });
      if (limit) query.limit(limit);

      const results = await query.exec();
      const transformedResults = this.transformResponseArray(results);

      return res
        .status(200)
        .json({ success: true, results: transformedResults });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getOneById(
    req: Request<Request_Result_GET_one_params>,
    res: Response<Response_Result_GET_one>
  ) {
    try {
      const { resultId } = req.params;

      const result = await ResultModel.findById(resultId).lean();
      if (!result) {
        throw new CustomError(`Result with id '${resultId}' not found`, 404);
      }

      const transformedResult = this.transformResponseObject(result);

      return res.status(200).json({ success: true, result: transformedResult });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async post(
    req: Request<{}, {}, Request_Result_POST_body>,
    res: Response<Response_Result_POST>
  ) {
    try {
      console.log('Request body: ', req.body);
      const { characterId, adventureId } = req.body;
      const currentDateMs = Date.now();

      const characterResponse =
        await this.apiService.get<Response_Character_GET_one>(
          `${PUBLIC_ROUTES.Characters}/${characterId}`
        );

      if (!characterResponse.success) {
        throw new CustomError(`'${characterResponse.error}'`, 500);
      }
      const { character } = characterResponse;

      const adventureResponse =
        await this.apiService.get<Response_Adventure_GET_one>(
          `${PUBLIC_ROUTES.Adventures}/${adventureId}`
        );

      if (!adventureResponse.success) {
        throw new CustomError(`'${adventureResponse.error}'`, 500);
      }
      const { adventure } = adventureResponse;

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
          await this.apiService.get<Response_CharacterAttribute_GET_all>(
            `${PUBLIC_ROUTES.CharacterAttributes}`,
            { params: charAttQueryString }
          );

        if (!characterAttributesRes.success) {
          throw new CustomError(`Character attributes error`, 500);
        }

        const characterAttributes =
          characterAttributesRes.characterAttributes as CharacterAttributeFrontendPopulated[];
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

  private transformResponseObject(
    databaseResponse: ResultBackend
  ): ResultFrontend {
    const { characterId, ...rest } = databaseResponse;
    return {
      ...rest,
      characterId: databaseResponse.characterId.toString(),
    };
  }

  private transformResponseArray(
    databaseResponse: ResultBackend[]
  ): ResultFrontend[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
