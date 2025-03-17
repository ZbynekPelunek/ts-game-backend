import { GetEnemyRequestParams } from '../../../../shared/src';
import { EnemyService } from '../../services/enemyService';

export class GetEnemyQuery {
  constructor(private enemyService: EnemyService) {}

  async execute(params: GetEnemyRequestParams) {
    const reward = await this.enemyService.getById(params);

    return this.enemyService.transformResponse(reward);
  }
}
