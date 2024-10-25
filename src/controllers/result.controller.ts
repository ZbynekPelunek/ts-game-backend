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
  InventoryPostActions,
  IRewardSchema,
  Reward,
  ResultReward,
  CommonItemsEquipmenParams,
  Currency,
  CurrencyId,
  Response_CharacterCurrency_GET_all,
  Request_CharacterCurrency_GET_all_query,
  Response_CharacterCurrency_PATCH,
  Request_CharacterCurrency_PATCH_body,
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
      const { characterId, limit, inProgress, rewardCollected } = req.query;

      const query = ResultModel.find().lean();

      if (characterId) query.where({ characterId });
      if (inProgress) query.where({ inProgress });
      if (rewardCollected) query.where({ rewardCollected });
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

  //TODO: add interfaces
  async checkInProgress(req: Request, res: Response) {
    try {
      const currentDate = new Date();

      const finishedResults = await ResultModel.find({
        inProgress: true,
        timeFinish: { $lte: currentDate },
      });

      if (finishedResults.length === 0) {
        return res.status(200).json({ success: true, finishedResults: [] });
      }

      const resultIds = finishedResults.map((result) => result._id);

      await ResultModel.updateMany(
        { _id: { $in: resultIds } },
        { $set: { inProgress: false } }
      );

      return res.status(200).json({ success: true, finishedResults });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  //TODO: add interfaces
  async collectReward(req: Request, res: Response) {
    try {
      const { resultId } = req.params;

      const uncollectedRewardResult =
        await ResultModel.findById(resultId).lean();

      if (!uncollectedRewardResult) {
        throw new CustomError(`Result with id '${resultId}' not found`, 404);
      }

      if (uncollectedRewardResult.rewardCollected) {
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
              itemId: ir.itemId,
            });
          } else {
            const item = ir.itemId as CommonItemsEquipmenParams;
            await this.addItemToInventory({
              characterId,
              amount: ir.amount,
              itemId: item.itemId,
            });
          }
        }
      }

      if (rewardExperience) {
        await this.updateCharacter({
          characterId,
          experience: rewardExperience,
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
              currencyId: currency.currencyId,
            });

            await this.updateCharacterCurrency({
              characterCurrencyId,
              amount: currency.amount,
            });
          } else {
            const currencyData = currency.currencyId as Currency;
            const characterCurrencyId = await this.findCharacterCurrencyId({
              characterId,
              currencyId: currencyData._id,
            });

            await this.updateCharacterCurrency({
              characterCurrencyId,
              amount: currency.amount,
            });
          }
        }
      }

      await ResultModel.updateOne(
        { _id: resultId },
        { $set: { rewardCollected: true } }
      );

      return res
        .status(200)
        .json({ success: true, collectedRewards: uncollectedRewardResult });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async post(
    req: Request<{}, {}, Request_Result_POST_body>,
    res: Response<Response_Result_POST>
  ) {
    try {
      const { characterId, adventureId } = req.body;

      const inProgressResultLimit = 3;
      const uncollectedRewardResultLimit = 10;

      const countInProgressResults = await ResultModel.countDocuments({
        characterId,
        inProgress: true,
      });
      const countUncollectedRewardResults = await ResultModel.countDocuments({
        characterId,
        rewardCollected: false,
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
          `${PUBLIC_ROUTES.Adventures}/${adventureId}?populateReward=true`
          // Doesnt work for some reason, need to set it manually
          // {
          //   params: {
          //     populateReward: true,
          //   },
          // }
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
        items: [],
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
              amount: i.amount * r.amount,
            });
          });
        }
        if (rewardObj.currencies) {
          rewardObj.currencies.forEach((c) => {
            const currency = c.currencyId as Currency;
            reward.currencies.push({
              currencyId: currency._id,
              amount: c.amount * r.amount,
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
        inProgress: true,
        reward,
        rewardCollected: false,
      };

      const createdResult = new ResultModel(result);

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

        createdResult.combat = combatResult;
      }

      const resultdbRes = await createdResult.save();
      console.log('resultdbRes: ', resultdbRes);

      return res.status(201).json({
        success: true,
        result: { resultId: createdResult.id, timeStart, timeFinish },
      });
    } catch (error) {
      errorHandler(error, req, res);
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
    >(`${PUBLIC_ROUTES.Inventory}/${InventoryPostActions.ADD_ITEM}`, data);

    if (!addItemResponse.success) {
      throw new CustomError(addItemResponse.error, 400);
    }
  }

  // TODO: add interfaces
  private async findCharacterCurrencyId(data: {
    characterId: string;
    currencyId: CurrencyId;
  }) {
    const queryParams: Request_CharacterCurrency_GET_all_query = {
      characterId: data.characterId,
      currencyId: data.currencyId,
    };

    const findCharCurrResponse =
      await this.apiService.get<Response_CharacterCurrency_GET_all>(
        `${PUBLIC_ROUTES.CharacterCurrencies}`,
        {
          params: queryParams,
        }
      );

    if (!findCharCurrResponse.success) {
      throw new CustomError(<string>findCharCurrResponse.error, 400);
    }

    return findCharCurrResponse.characterCurrencies[0]._id;
  }

  // TODO: add interfaces
  private async updateCharacterCurrency(data: {
    characterCurrencyId: string;
    amount: number;
  }) {
    const updateCharCurrResponse = await this.apiService.patch<
      Response_CharacterCurrency_PATCH,
      Request_CharacterCurrency_PATCH_body
    >(`${PUBLIC_ROUTES.CharacterCurrencies}/${data.characterCurrencyId}`, {
      amount: data.amount,
    });

    if (!updateCharCurrResponse.success) {
      throw new CustomError(<string>updateCharCurrResponse.error, 400);
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
    >(`${PUBLIC_ROUTES.Characters}/${data.characterId}/increase-experience`, {
      experience: data.experience,
    });

    if (!updateCharacterResponse.success) {
      throw new CustomError(<string>updateCharacterResponse.error, 400);
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
