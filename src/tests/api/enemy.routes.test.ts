import request from 'supertest';
import { describe, afterEach, it, expect } from '@jest/globals';

import { PUBLIC_ROUTES } from '../../server';
import { APP_SERVER } from '../setupFile';
import { Common_Response_Error } from '../../../../shared/src/interface/API/commonResponse';
import { Enemy, Enemy_GET_all, Enemy_GET_one } from '../../../../shared/src';
import { ENEMIES_MOCK } from '../../mockData/enemies';
import { EnemyModel } from '../../models/enemy.model';

describe('Enemy routes', () => {
  const apiAddress = PUBLIC_ROUTES.Enemies;

  afterEach(async () => {
    await EnemyModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all available enemies', async () => {
      await addEnemyToDb(ENEMIES_MOCK);

      const enemiesLength = await EnemyModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toStrictEqual(200);
      const rewardsResponse: Enemy_GET_all = res.body;
      expect(rewardsResponse.success).toStrictEqual(true);
      expect(rewardsResponse.enemies).toHaveLength(enemiesLength);
    });
  });

  describe(`GET ${apiAddress}/<ENEMY_ID>`, () => {
    it('returns status code 200 with correct enemy', async () => {
      await addEnemyToDb(ENEMIES_MOCK);
      const enemy2Id = ENEMIES_MOCK[1]._id;
      const enemy2name = ENEMIES_MOCK[1].name;

      const res = await request(APP_SERVER).get(`${apiAddress}/${enemy2Id}`);

      expect(res.statusCode).toStrictEqual(200);
      const rewardResponse: Enemy_GET_one = res.body;
      expect(rewardResponse.success).toStrictEqual(true);
      expect(rewardResponse.enemy._id).toStrictEqual(enemy2Id);
      expect(rewardResponse.enemy.name).toStrictEqual(enemy2name);
    });

    it('returns status code 404 when enemy ID is unknown', async () => {
      const unknownID = 199999;
      const res = await request(APP_SERVER).get(`${apiAddress}/${unknownID}`);

      expect(res.statusCode).toStrictEqual(404);
      const rewardResponse: Common_Response_Error = res.body;
      expect(rewardResponse.success).toStrictEqual(false);
      expect(rewardResponse.error).toStrictEqual(
        `Enemy with id '${unknownID}' not found.`
      );
    });
  });
});

async function addEnemyToDb(input: Enemy | Enemy[]) {
  return EnemyModel.create(input);
}
