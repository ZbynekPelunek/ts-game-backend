import { ListAdventuresRequestQuery, Reward } from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler';
import { AdventureModel } from '../models/adventure.model';

export class AdventureService {
  async list(queryParams: ListAdventuresRequestQuery) {
    const { populateReward, adventureLevel, type, limit, adventureId } =
      queryParams;

    const dbQuery = AdventureModel.find().lean();

    if (adventureId) dbQuery.where({ _id: adventureId });
    if (adventureLevel) dbQuery.where({ adventureLevel });
    if (type) dbQuery.where({ type });
    if (limit) dbQuery.limit(+limit);
    if (populateReward)
      dbQuery.populate<Reward>({
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

    return await dbQuery.exec();
  }

  async getOneById(adventureId: number) {
    const adventure = this.adventureIdExists(adventureId);

    return adventure;
  }

  private async adventureIdExists(adventureId: number, select?: string) {
    const dbQuery = AdventureModel.findById(adventureId).lean();
    if (select) {
      dbQuery.select(select);
    }
    const adventure = await dbQuery.exec();

    if (!adventure) {
      throw new CustomError(`Adventure with id ${adventureId} not found.`, 404);
    }
    return adventure;
  }
}
