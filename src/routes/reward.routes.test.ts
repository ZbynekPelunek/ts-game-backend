import request from 'supertest';
import { Reward, Reward_GET_one, Rewards_GET_all } from '../../../shared/src';
import { RewardModel } from '../schema/reward.schema';
import { PUBLIC_ROUTES } from '../server';
import { APP_SERVER } from '../tests/setupFile';
import { Common_Response_Error } from '../../../shared/src/interface/api-response/common';

export const mockRewards: Reward[] = [
  {
    _id: 1,
    experience: 5
  },
  {
    _id: 2,
    currencies: [2]
  },
  {
    _id: 3,
    items: [8]
  }
];

describe('Reward routes', () => {
  const apiAddress = PUBLIC_ROUTES.Rewards;


  afterEach(async () => {
    await RewardModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all available rewards', async () => {
      await addRewardToDb(mockRewards);

      const attributesLength = await RewardModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toStrictEqual(200);
      const attributesResponse: Rewards_GET_all = res.body;
      expect(attributesResponse.success).toStrictEqual(true);
      expect(attributesResponse.rewards).toHaveLength(attributesLength);
    });
  })

  describe(`GET ${apiAddress}/<REWARD_ID>`, () => {
    it('returns status code 200 with correct adventure', async () => {
      await addRewardToDb(mockRewards);
      const reward2Id = mockRewards[1]._id;
      const reward2currency = mockRewards[1].currencies;

      const res = await request(APP_SERVER).get(`${apiAddress}/${reward2Id}`);

      expect(res.statusCode).toStrictEqual(200);
      const attributeResponse: Reward_GET_one = res.body;
      expect(attributeResponse.success).toStrictEqual(true);
      expect(attributeResponse.reward._id).toStrictEqual(reward2Id);
      expect(attributeResponse.reward.currencies).toStrictEqual(reward2currency);
    });

    it('returns status code 404 when adventure ID is unknown', async () => {
      const unknownID = 199999
      const res = await request(APP_SERVER).get(`${apiAddress}/${unknownID}`);

      expect(res.statusCode).toStrictEqual(404);
      const attributeResponse: Common_Response_Error = res.body;
      expect(attributeResponse.success).toStrictEqual(false);
      expect(attributeResponse.error).toStrictEqual(`Reward with id '${unknownID}' not found.`);
    });
  })
})

async function addRewardToDb(input: Reward | Reward[]) {
  return await RewardModel.create(input);
}