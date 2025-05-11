import { GetEnemyRequestParams } from '../../../../shared/src';
import { EnemyService } from '../../services/enemy.service';

export class GetEnemyQuery {
  constructor(private enemyService: EnemyService) {}

  async execute(params: GetEnemyRequestParams) {
    const reward = await this.enemyService.getById(params);

    return this.enemyService.transformResponse(reward);
  }
}
