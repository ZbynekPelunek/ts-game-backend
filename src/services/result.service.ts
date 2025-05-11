import {
  CharacterAttributeDocument,
  CommonItemsEquipmenParams,
  Currency,
  ListCharacterAttributesRequestQuery,
  ListResultsRequestQuery,
  ResultBackend,
  ResultCombat,
  ResultReward,
  ResultState,
  Reward
} from '../../../shared/src';
import { Combat } from '../engine/combat';
import { CustomError } from '../middleware/errorHandler.middleware';
import { AdventureModel } from '../models/adventure.model';
import { CharacterModel } from '../models/character.model';
import { CharacterAttributeModel } from '../models/characterAttribute.model';
import { EnemyModel } from '../models/enemy.model';
import { ResultModel } from '../models/result.model';
import { ApiService } from './apiService';

export class ResultService {
  async list(queryParams: ListResultsRequestQuery) {
    const { characterId, limit, state } = queryParams;
    const query = ResultModel.find().lean();

    if (characterId) query.where({ characterId });
    if (state) query.where({ state });
    if (limit) query.limit(+limit);

    return await query.exec();
  }

  async getOneById(resultId: string) {
    const result = await ResultModel.findById(resultId).lean();
    if (!result) {
      throw new CustomError(`Result with id '${resultId}' not found`, 404);
    }

    return result;
  }

  async create(data: { characterId: string; adventureId: number }) {
    const { characterId, adventureId } = data;

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

    const currentDateMs = Date.now();

    const character = await CharacterModel.findById(characterId).lean();
    if (!character) {
      throw new CustomError(
        `Character with id '${characterId}' not found`,
        404
      );
    }

    const adventure = await AdventureModel.findById(adventureId)
      .lean()
      .populate<Reward>({
        path: 'rewards.rewardId',
        select: '-createdAt -updatedAt -__v',
        populate: [
          {
            path: 'currencies.currencyId'
          },
          {
            path: 'items.itemId',
            localField: 'items.itemId',
            foreignField: 'itemId'
          }
        ]
      });

    if (!adventure) {
      throw new CustomError(`Adventure with id ${adventureId} not found.`, 404);
    }

    const timeFinishMs = currentDateMs + adventure.timeInSeconds * 1000;

    const timeFinish = new Date(timeFinishMs).toISOString();
    const timeStart = new Date(currentDateMs).toISOString();

    const reward: ResultReward = {
      currencies: [],
      experience: 0,
      items: []
    };
    adventure.rewards.forEach((r) => {
      const rewardObj = r.rewardId as unknown as Reward;
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
      const characterAttributesDbResponse =
        await CharacterAttributeModel.find().lean();
      const enemy = await EnemyModel.findById(adventure.enemyIds[0]);

      if (!enemy) {
        throw new CustomError(
          `Enemy with id '${adventure.enemyIds[0]}' not found.`,
          500
        );
      }

      const characterAttributes = characterAttributesDbResponse.map(
        (charAtt) => {
          return {
            characterId: charAtt.characterId.toString(),
            baseValue: charAtt.baseValue!,
            addedValue: {
              equipment: charAtt.addedValue!.equipment!,
              otherAttributes: charAtt.addedValue!.otherAttributes!
            },
            totalValue: charAtt.totalValue!,
            attributeName: charAtt.attributeName
          };
        }
      );

      const combat = new Combat();
      combat.start(character.name, characterAttributes, enemy);

      const combatResult: ResultCombat = {
        log: combat.log,
        playerWon: combat.playerWon
      };

      createdResult.combat = combatResult;
    }

    const resultDbRes = await createdResult.save();

    return resultDbRes;
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
