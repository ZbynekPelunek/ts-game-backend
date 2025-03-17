import {
  EnemyDocument,
  EnemyDTO,
  GetEnemyRequestParams
} from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler';
import { EnemyModel } from '../models/enemy.model';

export class EnemyService {
  async list() {
    // TODO: fix transformResponse() interfaces to make it work with .lean()
    const enemiesQuery = EnemyModel.find();

    return enemiesQuery.exec();
  }

  async getById(params: GetEnemyRequestParams) {
    const { enemyId } = params;

    const enemy = await EnemyModel.findById(enemyId);

    if (!enemy) {
      throw new CustomError(`Enemy with id '${enemyId}' not found.`, 404);
    }

    return enemy;
  }

  public transformResponse(databaseResponse: EnemyDocument[]): EnemyDTO[];
  public transformResponse(databaseResponse: EnemyDocument): EnemyDTO;
  public transformResponse(
    databaseResponse: EnemyDocument | EnemyDocument[]
  ): EnemyDTO | EnemyDTO[] {
    if (Array.isArray(databaseResponse)) {
      return this.transformResponseArray(databaseResponse);
    } else {
      return this.transformResponseObject(databaseResponse);
    }
  }

  private transformResponseObject(databaseResponse: EnemyDocument): EnemyDTO {
    return {
      _id: databaseResponse._id,
      attributes: databaseResponse.attributes,
      name: databaseResponse.name,
      type: databaseResponse.type
    };
  }

  private transformResponseArray(
    databaseResponse: EnemyDocument[]
  ): EnemyDTO[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
