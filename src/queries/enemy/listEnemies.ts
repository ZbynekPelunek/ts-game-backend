import { EnemyService } from '../../services/enemyService';

export class ListEnemiesQuery {
  constructor(private enemyService: EnemyService) {}

  async execute() {
    const enemy = await this.enemyService.list();

    return this.enemyService.transformResponse(enemy);
  }
}
