import {
  GetRewardRequestParams,
  RewardDocument,
  RewardDTO
} from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler';
import { RewardModel } from '../models/rewardModel';

export class RewardService {
  async list() {
    // TODO: fix transformResponse() interfaces to make it work with .lean()
    const rewardsQuery = RewardModel.find();

    return rewardsQuery.exec();
  }

  async getById(params: GetRewardRequestParams) {
    const { rewardId } = params;

    const reward = await RewardModel.findById(rewardId);
    //console.log('Reward One lean response: ', reward);

    if (!reward) {
      throw new CustomError(`Reward with id '${rewardId}' not found.`, 404);
    }

    return reward;
  }

  public transformResponse(databaseResponse: RewardDocument[]): RewardDTO[];
  public transformResponse(databaseResponse: RewardDocument): RewardDTO;
  public transformResponse(
    databaseResponse: RewardDocument | RewardDocument[]
  ): RewardDTO | RewardDTO[] {
    if (Array.isArray(databaseResponse)) {
      return this.transformResponseArray(databaseResponse);
    } else {
      return this.transformResponseObject(databaseResponse);
    }
  }

  private transformResponseObject(databaseResponse: RewardDocument): RewardDTO {
    return {
      _id: databaseResponse._id,
      currencies: databaseResponse.currencies,
      experience: databaseResponse.experience,
      items: databaseResponse.items
    };
  }

  private transformResponseArray(
    databaseResponse: RewardDocument[]
  ): RewardDTO[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
