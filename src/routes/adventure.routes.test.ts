import request from 'supertest';
import { describe, afterEach, it, expect, beforeAll } from '@jest/globals';

import {
  Adventure,
  Adventure_GET_all,
  Adventure_GET_one,
  Request_Adventure_GET_all_query,
  Reward
} from '../../../shared/src';
import { AdventureModel } from '../schema/adventure.schema';
import { APP_SERVER } from '../tests/setupFile';
import { PUBLIC_ROUTES } from '../server';
import { RewardModel } from '../schema/reward.schema';
import { REWARDS_MOCK } from '../mockData/rewards';
import { ADVENTURES_MOCK } from '../mockData/adventures';
import { Common_Response_Error } from '../../../shared/src/interface/API/commonResponse';

describe('Adventure routes', () => {
  const apiAddress = PUBLIC_ROUTES.Adventures;

  beforeAll(async () => {
    await AdventureModel.deleteMany();
    await RewardModel.deleteMany();
  });

  afterEach(async () => {
    await AdventureModel.deleteMany();
    await RewardModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all available adventures', async () => {
      await addAdventureToDb(ADVENTURES_MOCK);

      const adventuresLength = await AdventureModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const adventuresResponse: Adventure_GET_all = res.body;
      expect(adventuresResponse.success).toBe(true);
      expect(adventuresResponse.adventures).toHaveLength(adventuresLength);
    });

    it('returns status code 200 with all available adventures and papulated reward', async () => {
      const queryString: Request_Adventure_GET_all_query = {
        populateReward: true
      };
      const reward1Id = REWARDS_MOCK[0]._id;
      await RewardModel.create(REWARDS_MOCK);
      ADVENTURES_MOCK[0].rewards[0].rewardId = reward1Id;
      ADVENTURES_MOCK[1].rewards[0].rewardId = REWARDS_MOCK[1]._id;
      ADVENTURES_MOCK[2].rewards[0].rewardId = REWARDS_MOCK[2]._id;
      await addAdventureToDb(ADVENTURES_MOCK);

      const adventuresLength = await AdventureModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress).query(queryString);

      expect(res.statusCode).toEqual(200);
      const adventuresResponse: Adventure_GET_all = res.body;
      expect(adventuresResponse.success).toBe(true);
      expect(adventuresResponse.adventures).toHaveLength(adventuresLength);
      const adventure1RewardPopulated = adventuresResponse.adventures[0]
        .rewards[0].rewardId as Reward;
      console.log(
        'adventuresResponse.adventures[0].rewards values: ',
        adventuresResponse.adventures[0].rewards
      );
      expect(adventure1RewardPopulated._id).toStrictEqual(reward1Id);
    });
  });

  describe(`GET ${apiAddress}/<ADVENTURE_ID>`, () => {
    it('returns status code 200 with correct adventure', async () => {
      await addAdventureToDb(ADVENTURES_MOCK);
      const adventure2Id = ADVENTURES_MOCK[1].adventureId;
      const adventure2Name = ADVENTURES_MOCK[1].name;

      const res = await request(APP_SERVER).get(
        `${apiAddress}/${adventure2Id}`
      );

      expect(res.statusCode).toEqual(200);
      const adventureResponse: Adventure_GET_one = res.body;
      expect(adventureResponse.success).toBe(true);
      expect(adventureResponse.adventure.adventureId).toBe(adventure2Id);
      expect(adventureResponse.adventure.name).toBe(adventure2Name);
    });

    it('returns status code 404 when adventure ID is unknown', async () => {
      const unknownID = 199999;
      const res = await request(APP_SERVER).get(`${apiAddress}/${unknownID}`);

      expect(res.statusCode).toEqual(404);
      const adventureResponse: Common_Response_Error = res.body;
      expect(adventureResponse.success).toBe(false);
      expect(adventureResponse.error).toBe(
        `Adventure with id '${unknownID}' not found.`
      );
    });
  });
});

async function addAdventureToDb(input: Adventure | Adventure[]) {
  return await AdventureModel.create(input);
}
