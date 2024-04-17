import request from 'supertest';
import { describe, afterEach, it, expect } from '@jest/globals';

import { Reward, Reward_GET_one, Reward_GET_all } from '../../../shared/src';
import { RewardModel } from '../schema/reward.schema';
import { PUBLIC_ROUTES } from '../server';
import { APP_SERVER } from '../tests/setupFile';
import { REWARDS_MOCK } from '../mockData/rewards';
import { Common_Response_Error } from '../../../shared/src/interface/API/commonResponse';

describe('Reward routes', () => {
  const apiAddress = PUBLIC_ROUTES.Rewards;

  afterEach(async () => {
    await RewardModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all available rewards', async () => {
      await addRewardToDb(REWARDS_MOCK);

      const rewardsLength = await RewardModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toStrictEqual(200);
      const rewardsResponse: Reward_GET_all = res.body;
      expect(rewardsResponse.success).toStrictEqual(true);
      expect(rewardsResponse.rewards).toHaveLength(rewardsLength);
    });
  });

  describe(`GET ${apiAddress}/<REWARD_ID>`, () => {
    it('returns status code 200 with correct reward', async () => {
      await addRewardToDb(REWARDS_MOCK);
      const reward2Id = REWARDS_MOCK[1]._id;
      const reward2currency = REWARDS_MOCK[1].currencies;

      const res = await request(APP_SERVER).get(`${apiAddress}/${reward2Id}`);

      expect(res.statusCode).toStrictEqual(200);
      const rewardResponse: Reward_GET_one = res.body;
      expect(rewardResponse.success).toStrictEqual(true);
      expect(rewardResponse.reward._id).toStrictEqual(reward2Id);
      expect(rewardResponse.reward.currencies).toStrictEqual(reward2currency);
    });

    it('returns status code 404 when reward ID is unknown', async () => {
      const unknownID = 199999;
      const res = await request(APP_SERVER).get(`${apiAddress}/${unknownID}`);

      expect(res.statusCode).toStrictEqual(404);
      const rewardResponse: Common_Response_Error = res.body;
      expect(rewardResponse.success).toStrictEqual(false);
      expect(rewardResponse.error).toStrictEqual(
        `Reward with id '${unknownID}' not found.`
      );
    });
  });
});

async function addRewardToDb(input: Reward | Reward[]) {
  return RewardModel.create(input);
}
