import request from 'supertest';

import { Adventure, Adventures_GET_all, Adventures_GET_one, Request_Adventure_GET_one_query, Reward } from '../../../shared/src';
import { AdventureModel } from '../schema/adventure.schema';
import { APP_SERVER } from '../tests/setupFile';
import { PUBLIC_ROUTES } from '../server';
import { Common_Response_Error } from '../../../shared/src/interface/api-response/common';
import { RewardModel } from '../schema/reward.schema';
import { mockRewards } from './reward.routes.test';

export const mockAdventures: Adventure[] = [
  {
    adventureId: 1,
    level: 5,
    name: 'Adventure 1',
    reward: [5],
    timeInSeconds: 500
  },
  {
    adventureId: 2,
    level: 5,
    name: 'Adventure 2',
    reward: [1],
    timeInSeconds: 500,
    enemyId: [4]
  },
  {
    adventureId: 3,
    level: 5,
    name: 'Adventure 3',
    reward: [5],
    timeInSeconds: 500,
    requiredLevel: 10
  }
];

describe('Adventure routes', () => {
  const apiAddress = PUBLIC_ROUTES.Adventures;

  beforeAll(async () => {
    await AdventureModel.deleteMany();
    await RewardModel.deleteMany();
  })

  afterEach(async () => {
    await AdventureModel.deleteMany();
    await RewardModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all available adventures', async () => {
      await addAdventureToDb(mockAdventures);

      const attributesLength = await AdventureModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const attributesResponse: Adventures_GET_all = res.body;
      expect(attributesResponse.success).toBe(true);
      expect(attributesResponse.adventures).toHaveLength(attributesLength);
    });

    it('returns status code 200 with all available adventures and papulated reward', async () => {
      const queryString: Request_Adventure_GET_one_query = { populateReward: true };
      const reward1Id = mockRewards[0]._id;
      await RewardModel.create(mockRewards);
      mockAdventures[0].reward[0] = reward1Id;
      mockAdventures[1].reward[0] = mockRewards[1]._id;
      mockAdventures[2].reward[0] = mockRewards[2]._id;
      await addAdventureToDb(mockAdventures);

      const attributesLength = await AdventureModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress).query(queryString);

      expect(res.statusCode).toEqual(200);
      const attributesResponse: Adventures_GET_all = res.body;
      expect(attributesResponse.success).toBe(true);
      expect(attributesResponse.adventures).toHaveLength(attributesLength);
      const adventure1rewardArr = attributesResponse.adventures[0].reward as Reward[];
      expect(adventure1rewardArr[0]._id).toStrictEqual(reward1Id);
    });
  })

  describe(`GET ${apiAddress}/<ADVENTURE_ID>`, () => {
    it('returns status code 200 with correct adventure', async () => {
      await addAdventureToDb(mockAdventures);
      const adventure2Id = mockAdventures[1].adventureId;
      const adventure2Name = mockAdventures[1].name;

      const res = await request(APP_SERVER).get(`${apiAddress}/${adventure2Id}`);

      expect(res.statusCode).toEqual(200);
      const attributeResponse: Adventures_GET_one = res.body;
      expect(attributeResponse.success).toBe(true);
      expect(attributeResponse.adventure.adventureId).toBe(adventure2Id);
      expect(attributeResponse.adventure.name).toBe(adventure2Name);
    });

    it('returns status code 404 when adventure ID is unknown', async () => {
      const unknownID = 199999
      const res = await request(APP_SERVER).get(`${apiAddress}/${unknownID}`);

      expect(res.statusCode).toEqual(404);
      const attributeResponse: Common_Response_Error = res.body;
      expect(attributeResponse.success).toBe(false);
      expect(attributeResponse.error).toBe(`Adventure with id '${unknownID}' not found.`);
    });
  })
})

async function addAdventureToDb(input: Adventure | Adventure[]) {
  return await AdventureModel.create(input);
}