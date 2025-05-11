import { EnemyService } from '../../services/enemy.service';

export class ListEnemiesQuery {
  constructor(private enemyService: EnemyService) {}

  async execute() {
    const enemy = await this.enemyService.list();

    return this.enemyService.transformResponse(enemy);
  }
}
