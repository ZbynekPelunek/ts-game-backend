import request from 'supertest';
import { describe, afterEach, it, expect, beforeAll } from '@jest/globals';

import {
  Adventure,
  Adventure_GET_all,
  Adventure_GET_one,
  AdventureTypes,
  Request_Adventure_GET_all_query,
  Reward,
} from '../../../../shared/src';
import { APP_SERVER } from '../setupFile';
import { REWARDS_MOCK } from '../../mockData/rewards';
import { ADVENTURES_MOCK } from '../../mockData/adventures';
import { Common_Response_Error } from '../../../../shared/src/interface/API/commonResponse';
import { AdventureModel } from '../../models/adventure.model';
import { RewardModel } from '../../models/reward.model';
import { PUBLIC_ROUTES } from '../../services/api.service';

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

    it('returns status code 200 with all available adventures and populated reward', async () => {
      const queryString: Request_Adventure_GET_all_query = {
        populateReward: true,
      };
      const adventures = [...ADVENTURES_MOCK];
      await RewardModel.create(REWARDS_MOCK);
      adventures[0].rewards[0].rewardId = REWARDS_MOCK[0]._id;
      adventures[1].rewards[0].rewardId = REWARDS_MOCK[1]._id;
      adventures[2].rewards[0].rewardId = REWARDS_MOCK[2]._id;
      await addAdventureToDb(adventures);

      const adventuresLength = await AdventureModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress).query(queryString);

      expect(res.statusCode).toEqual(200);
      const adventuresResponse: Adventure_GET_all = res.body;
      expect(adventuresResponse.success).toBe(true);
      expect(adventuresResponse.adventures).toHaveLength(adventuresLength);
      const adventure1RewardPopulated = adventuresResponse.adventures[0]
        .rewards[0].rewardId as Reward;
      expect(adventure1RewardPopulated._id).toBeDefined();
    });

    it('returns status code 200 with all available adventures with adventure level 2', async () => {
      const queryString: Request_Adventure_GET_all_query = {
        adventureLevel: 2,
      };
      await addAdventureToDb(ADVENTURES_MOCK);

      const adventuresLength = await AdventureModel.countDocuments({
        adventureLevel: 2,
      });

      const res = await request(APP_SERVER).get(apiAddress).query(queryString);

      expect(res.statusCode).toEqual(200);
      const adventuresResponse: Adventure_GET_all = res.body;
      expect(adventuresResponse.success).toBe(true);
      expect(adventuresResponse.adventures).toHaveLength(adventuresLength);
    });

    it(`returns status code 200 with all available adventures with adventure type ${AdventureTypes.TUTORIAL}`, async () => {
      const queryString: Request_Adventure_GET_all_query = {
        type: AdventureTypes.TUTORIAL,
      };
      await addAdventureToDb(ADVENTURES_MOCK);

      const adventuresLength = await AdventureModel.countDocuments({
        type: AdventureTypes.TUTORIAL,
      });

      const res = await request(APP_SERVER).get(apiAddress).query(queryString);

      expect(res.statusCode).toEqual(200);
      const adventuresResponse: Adventure_GET_all = res.body;
      expect(adventuresResponse.success).toBe(true);
      expect(adventuresResponse.adventures).toHaveLength(adventuresLength);
    });

    it('returns status code 200 with adventures limited to 3', async () => {
      const limit = 3;
      const queryString: Request_Adventure_GET_all_query = {
        limit,
      };
      await addAdventureToDb(ADVENTURES_MOCK);

      const adventuresLength = await AdventureModel.countDocuments(undefined, {
        limit,
      });

      const res = await request(APP_SERVER).get(apiAddress).query(queryString);

      expect(res.statusCode).toEqual(200);
      const adventuresResponse: Adventure_GET_all = res.body;
      expect(adventuresResponse.success).toBe(true);
      expect(adventuresResponse.adventures).toHaveLength(adventuresLength);
    });
  });

  describe(`GET ${apiAddress}/<ADVENTURE_ID>`, () => {
    it('returns status code 200 with correct adventure', async () => {
      await addAdventureToDb(ADVENTURES_MOCK);
      const adventure2Id = ADVENTURES_MOCK[1]._id;
      const adventure2Name = ADVENTURES_MOCK[1].name;

      const res = await request(APP_SERVER).get(
        `${apiAddress}/${adventure2Id}`
      );

      expect(res.statusCode).toEqual(200);
      const adventureResponse: Adventure_GET_one = res.body;
      expect(adventureResponse.success).toBe(true);
      expect(adventureResponse.adventure._id).toBe(adventure2Id);
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
  return AdventureModel.create(input);
}
