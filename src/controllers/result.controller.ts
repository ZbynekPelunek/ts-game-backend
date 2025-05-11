import { NextFunction, Request, Response } from 'express-serve-static-core';
import { AnyBulkWriteOperation, Types } from 'mongoose';

import {
  CreateResultRequestBody,
  CreateResultResponse,
  ResultCombat,
  ListResultsRequestQuery,
  ListResultsResponse,
  ResultBackend,
  GetResultResponse,
  GetResultRequestParams,
  GetCharacterResponse,
  GetAdventureResponse,
  InventoryPostActions,
  Reward,
  ResultReward,
  CommonItemsEquipmenParams,
  Currency,
  CurrencyId,
  ListCharacterCurrenciesResponse,
  ListCharacterCurrenciesQuery,
  UpdateCharacterCurrencyResponse,
  ListCharacterAttributesRequestQuery,
  ListCharacterAttributesResponse,
  ResultState,
  UpdateCharacterCurrencyRequestDTO
} from '../../../shared/src';
import { Combat } from '../engine/combat';
import { EnemyModel } from '../models/enemy.model';
import { ResultModel, ResultSchema } from '../models/result.model';
import { ApiService, V1_ROUTES } from '../services/apiService';
import {
  CustomError,
  errorHandler
} from '../middleware/errorHandler.middleware';
import { ResultService } from '../services/result.service';

export class ResultController {
  private apiService: ApiService;
  private resultService: ResultService;

  constructor() {
    this.apiService = new ApiService();
    this.resultService = new ResultService();
  }

  async list(
    req: Request<{}, {}, {}, ListResultsRequestQuery>,
    res: Response<ListResultsResponse>
  ) {
    const { characterId, limit, state } = req.query;

    const results = await this.resultService.list({
      characterId,
      limit,
      state
    });

    res.status(200).json({
      success: true,
      results: results.map((result) => {
        return {
          _id: result._id.toString(),
          adventureId: result.adventureId,
          adventureName: result.adventureName,
          characterId: result.characterId.toString(),
          reward: result.reward,
          state: result.state,
          timeFinish: result.timeFinish,
          timeStart: result.timeStart,
          combat: result.combat
        };
      })
    });
  }

  async getOneById(
    req: Request<GetResultRequestParams>,
    res: Response<GetResultResponse>
  ) {
    const { resultId } = req.params;

    const result = await this.resultService.getOneById(resultId);

    res.status(200).json({
      success: true,
      result: {
        _id: result._id.toString(),
        adventureId: result.adventureId,
        adventureName: result.adventureName,
        characterId: result.characterId.toString(),
        reward: result.reward,
        state: result.state,
        timeFinish: result.timeFinish,
        timeStart: result.timeStart,
        combat: result.combat
      }
    });
  }

  //TODO: add interfaces
  async checkInProgress(req: Request, res: Response, _next: NextFunction) {
    try {
      const { characterId } = req.body;
      const currentDate = new Date();

      const resultsInProgress = await ResultModel.find({
        characterId,
        state: ResultState.IN_PROGRESS
      }).lean();

      if (resultsInProgress.length === 0) {
        res.status(200).json({ success: true });
        return;
      }

      const bulkOperations:
        | AnyBulkWriteOperation<ResultSchema>[]
        | {
            updateOne: {
              filter: { _id: Types.ObjectId };
              update: { $set: { state: ResultState } };
            };
          }[] = [];
      resultsInProgress.forEach((result) => {
        const finishTime = new Date(result.timeFinish);

        if (finishTime <= currentDate) {
          bulkOperations.push({
            updateOne: {
              filter: { _id: result._id },
              update: {
                $set: { state: ResultState.FINISHED }
              }
            }
          });
        }
      });

      await ResultModel.bulkWrite(bulkOperations);

      res.status(200).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  //TODO: add interfaces
  async cancelAdventure(req: Request, res: Response, _next: NextFunction) {
    try {
      const { resultId } = req.params;

      const result = await ResultModel.findById(resultId).lean();

      if (!result) {
        throw new CustomError('Result not found', 404);
      }

      await ResultModel.findByIdAndUpdate(resultId, {
        $set: { state: ResultState.CANCELED }
      });

      res.status(200).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  //TODO: add interfaces
  async skipAdventure(req: Request, res: Response, _next: NextFunction) {
    try {
      const currentDate = new Date().toISOString();
      const { resultId } = req.params;

      const result = await ResultModel.findById(resultId).lean();

      if (!result) {
        throw new CustomError('Result not found', 404);
      }

      await ResultModel.findByIdAndUpdate(resultId, {
        $set: { state: ResultState.SKIPPED, timeFinish: currentDate }
      });

      res.status(200).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async finishResult(req: Request, res: Response, _next: NextFunction) {
    try {
      const currentDate = Date.now();
      const { resultId } = req.params;

      const result = await ResultModel.findById(resultId).lean();

      if (!result) {
        throw new CustomError('Result not found', 404);
      }

      const finishTime = new Date(result.timeFinish).getTime();

      if (currentDate - finishTime < 0) {
        throw new CustomError('Result is not finished yet', 400);
      }

      await ResultModel.findByIdAndUpdate(resultId, {
        $set: { state: ResultState.FINISHED }
      });

      res.status(200).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  //TODO: add interfaces
  async collectReward(req: Request, res: Response, _next: NextFunction) {
    try {
      const { resultId } = req.params;

      const uncollectedRewardResult =
        await ResultModel.findById(resultId).lean();

      if (!uncollectedRewardResult) {
        throw new CustomError(`Result with id '${resultId}' not found`, 404);
      }

      if (uncollectedRewardResult.state === ResultState.REWARD_COLLECTED) {
        throw new CustomError(
          `Result with id '${resultId}' has already colllected reward.`,
          400
        );
      }

      const characterId = uncollectedRewardResult.characterId.toString();
      const rewardItems = uncollectedRewardResult.reward.items;
      const rewardExperience = uncollectedRewardResult.reward.experience;
      const rewardCurrencies = uncollectedRewardResult.reward.currencies;

      if (rewardItems.length > 0) {
        for (const ir of rewardItems) {
          if (typeof ir.itemId === 'number' && !isNaN(ir.itemId)) {
            await this.addItemToInventory({
              characterId,
              amount: ir.amount,
              itemId: ir.itemId
            });
          } else {
            const item = ir.itemId as CommonItemsEquipmenParams;
            await this.addItemToInventory({
              characterId,
              amount: ir.amount,
              itemId: item.itemId
            });
          }
        }
      }

      if (rewardExperience) {
        await this.updateCharacter({
          characterId,
          experience: rewardExperience
        });
      }

      if (rewardCurrencies.length > 0) {
        for (const currency of rewardCurrencies) {
          if (
            typeof currency.currencyId === 'number' &&
            !isNaN(currency.currencyId)
          ) {
            const characterCurrencyId = await this.findCharacterCurrencyId({
              characterId,
              currencyId: currency.currencyId
            });

            await this.updateCharacterCurrency({
              characterCurrencyId,
              amount: currency.amount
            });
          } else {
            const currencyData = currency.currencyId as Currency;
            const characterCurrencyId = await this.findCharacterCurrencyId({
              characterId,
              currencyId: currencyData._id
            });

            await this.updateCharacterCurrency({
              characterCurrencyId,
              amount: currency.amount
            });
          }
        }
      }

      await ResultModel.updateOne(
        { _id: resultId },
        { $set: { state: ResultState.REWARD_COLLECTED } }
      );

      res.status(200).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async create(
    req: Request<{}, {}, CreateResultRequestBody>,
    res: Response<CreateResultResponse>,
    _next: NextFunction
  ) {
    try {
      const { characterId, adventureId } = req.body;

      const inProgressResultLimit = 3;
      const uncollectedRewardResultLimit = 10;

      const countInProgressResults = await ResultModel.countDocuments({
        characterId,
        state: ResultState.IN_PROGRESS
      });
      const countUncollectedRewardResults = await ResultModel.countDocuments({
        characterId,
        state: ResultState.FINISHED
      });

      console.log('Adventures in progress: ', countInProgressResults);

      if (
        countInProgressResults >= inProgressResultLimit ||
        countUncollectedRewardResults >= uncollectedRewardResultLimit
      ) {
        throw new CustomError(
          `You can only have ${inProgressResultLimit} adventures in progress or ${uncollectedRewardResultLimit} adventures with uncollected rewards.`,
          400
        );
      }

      console.log('Request body: ', req.body);

      const currentDateMs = Date.now();

      const characterResponse = await this.apiService.get<GetCharacterResponse>(
        `${V1_ROUTES.Characters}/${characterId}`,
        {
          withCredentials: true
        }
      );

      if (!characterResponse.success) {
        throw new CustomError(`'${characterResponse.error}'`, 500);
      }
      const { character } = characterResponse;

      const adventureResponse = await this.apiService.get<GetAdventureResponse>(
        `${V1_ROUTES.Adventures}/${adventureId}`,
        {
          params: {
            populateReward: true
          }
        }
      );

      if (!adventureResponse.success) {
        throw new CustomError(`'${adventureResponse.error}'`, 500);
      }

      console.log(
        'Result.controller-POST-adventureReponse: ',
        adventureResponse.adventure.rewards
      );

      const { adventure } = adventureResponse;

      const timeFinishMs = currentDateMs + adventure.timeInSeconds * 1000;

      const timeFinish = new Date(timeFinishMs).toISOString();
      const timeStart = new Date(currentDateMs).toISOString();

      const reward: ResultReward = {
        currencies: [],
        experience: 0,
        items: []
      };
      adventure.rewards.forEach((r) => {
        const rewardObj = r.rewardId as Reward;
        if (rewardObj.experience) {
          reward.experience += rewardObj.experience * r.amount;
        }
        if (rewardObj.items) {
          rewardObj.items.forEach((i) => {
            const item = i.itemId as CommonItemsEquipmenParams;
            reward.items.push({
              itemId: item.itemId,
              amount: i.amount * r.amount
            });
          });
        }
        if (rewardObj.currencies) {
          rewardObj.currencies.forEach((c) => {
            const currency = c.currencyId as Currency;
            reward.currencies.push({
              currencyId: currency._id,
              amount: c.amount * r.amount
            });
          });
        }
      });

      this.mergeDuplicates(reward.items, 'itemId', 'amount');
      this.mergeDuplicates(reward.currencies, 'currencyId', 'amount');

      const result: ResultBackend = {
        adventureId,
        adventureName: adventure.name,
        characterId,
        combat: null,
        timeFinish,
        timeStart,
        reward,
        state: ResultState.IN_PROGRESS
      };

      const createdResult = new ResultModel(result);

      if (adventure.enemyIds?.length) {
        const charAttQueryString: ListCharacterAttributesRequestQuery = {
          populateAttribute: 'true',
          characterId
        };
        const characterAttributesRes =
          await this.apiService.get<ListCharacterAttributesResponse>(
            `${V1_ROUTES.CharacterAttributes}`,
            { params: charAttQueryString }
          );

        if (!characterAttributesRes.success) {
          throw new CustomError(`Character attributes error`, 500);
        }

        const { characterAttributes } = characterAttributesRes;
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
          playerWon: combat.playerWon
        };

        createdResult.combat = combatResult;
      }

      const resultdbRes = await createdResult.save();
      //console.log('resultdbRes: ', resultdbRes);

      res.status(201).json({
        success: true,
        result: { resultId: createdResult.id, timeStart, timeFinish, reward }
      });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  // TODO: add interfaces
  private async addItemToInventory(data: {
    characterId: string;
    itemId: number;
    amount: number;
  }): Promise<void> {
    const addItemResponse = await this.apiService.post<
      {
        success: boolean;
        inventory?: any;
        error?: any;
      },
      { characterId: string; itemId: number; amount: number }
    >(`${V1_ROUTES.Inventory}/${InventoryPostActions.ADD_ITEM}`, data);

    if (!addItemResponse.success) {
      throw new CustomError(addItemResponse.error, 400);
    }
  }

  // TODO: add interfaces
  private async findCharacterCurrencyId(data: {
    characterId: string;
    currencyId: CurrencyId;
  }) {
    const queryParams: ListCharacterCurrenciesQuery = {
      characterId: data.characterId,
      currencyId: data.currencyId
    };

    const findCharCurrResponse =
      await this.apiService.get<ListCharacterCurrenciesResponse>(
        `${V1_ROUTES.CharacterCurrencies}`,
        {
          params: queryParams
        }
      );

    if (!findCharCurrResponse.success) {
      throw new CustomError(findCharCurrResponse.error.message, 400);
    }

    return findCharCurrResponse.characterCurrencies[0]._id;
  }

  // TODO: add interfaces
  private async updateCharacterCurrency(data: {
    characterCurrencyId: string;
    amount: number;
  }) {
    const updateCharCurrResponse = await this.apiService.patch<
      UpdateCharacterCurrencyResponse,
      UpdateCharacterCurrencyRequestDTO
    >(`${V1_ROUTES.CharacterCurrencies}/${data.characterCurrencyId}`, {
      amount: data.amount
    });

    if (!updateCharCurrResponse.success) {
      throw new CustomError(updateCharCurrResponse.error.message, 400);
    }
  }

  // TODO: add interfaces
  private async updateCharacter(data: {
    characterId: string;
    experience: number;
  }) {
    const updateCharacterResponse = await this.apiService.patch<
      {
        success: boolean;
        character?: any;
        error?: any;
      },
      { experience: number }
    >(`${V1_ROUTES.Characters}/${data.characterId}/increase-experience`, {
      experience: data.experience
    });

    if (!updateCharacterResponse.success) {
      throw new CustomError(<string>updateCharacterResponse.error, 400);
    }
  }

  private mergeDuplicates<T>(
    items: T[],
    idKey: keyof T,
    amountKey: keyof T
  ): T[] {
    const itemMap = new Map<any, T>();

    // Iterate through the items and sum amounts for the same idKey
    items.forEach((item) => {
      const id = item[idKey];
      const amount = item[amountKey];

      if (itemMap.has(id)) {
        const existingItem = itemMap.get(id)!;
        // Update the existing item's amount
        (existingItem[amountKey] as any) += amount as any;
      } else {
        // Add a new item to the map
        itemMap.set(id, { ...item });
      }
    });

    // Convert the map back to an array of objects
    return Array.from(itemMap.values());
  }
}
