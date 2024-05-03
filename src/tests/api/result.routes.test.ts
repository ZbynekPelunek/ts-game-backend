import request from 'supertest';
import { describe, afterEach, it, expect } from '@jest/globals';

import { PUBLIC_ROUTES } from '../../server';
import {
  Adventure,
  Enemy,
  EnemyTypes,
  MainAttributeNames,
  Request_Result_POST_body,
  Response_CharacterAttribute_GET_all,
  Result,
  Result_POST,
} from '../../../../shared/src';
import { RESULTS_MOCK } from '../../mockData/results';
import { APP_SERVER, mockedAxios } from '../setupFile';
import { CHARACTERS_MOCK_ACCOUNT_1_ID } from '../../mockData/characters';
import { ADVENTURES_MOCK } from '../../mockData/adventures';
import { AdventureModel } from '../../models/adventure.model';
import { CharacterModel } from '../../models/character.model';
import { EnemyModel } from '../../models/enemy.model';
import { ResultModel } from '../../models/result.model';

describe('Result routes', () => {
  const apiAddress = PUBLIC_ROUTES.Results;

  afterEach(async () => {
    await ResultModel.deleteMany();
    await CharacterModel.deleteMany();
    await AdventureModel.deleteMany();
    await EnemyModel.deleteMany();
  });

  describe(`POST ${apiAddress}`, () => {
    it('returns status code 201 with created Result with NO combat (adventure without enemy)', async () => {
      const character = await CharacterModel.create({
        accountId: CHARACTERS_MOCK_ACCOUNT_1_ID,
        name: 'ResultTest',
      });
      const adventure = await AdventureModel.create(ADVENTURES_MOCK[0]);

      const requestBody: Request_Result_POST_body = {
        adventureId: adventure.id,
        characterId: character.id,
      };
      await addResultToDb(RESULTS_MOCK);

      const resultsLength = await ResultModel.countDocuments();

      const res = await request(APP_SERVER).post(apiAddress).send(requestBody);

      const resultsNewLength = await ResultModel.countDocuments();

      expect(resultsNewLength).toEqual(resultsLength + 1);
      expect(res.statusCode).toStrictEqual(201);
      const resultResponse: Result_POST = res.body;
      expect(resultResponse.success).toStrictEqual(true);
      expect(resultResponse.result).toBeDefined();
      expect(resultResponse.result.resultId).toBeDefined();
      expect(resultResponse.result.timeStart).toBeDefined();
      expect(resultResponse.result.timeFinish).toBeDefined();
      const dateStartValue = new Date(
        resultResponse.result.timeStart
      ).valueOf();
      const dateFinishValue = new Date(
        resultResponse.result.timeFinish
      ).valueOf();
      console.log('dateStartValue: ', dateStartValue);
      console.log('dateFinishValue: ', dateFinishValue);
      expect(dateFinishValue - dateStartValue).toEqual(
        adventure.timeInSeconds * 1000
      );
    });

    it('returns status code 201 with created Result with combat (adventure with an enemy)', async () => {
      const character = await CharacterModel.create({
        accountId: CHARACTERS_MOCK_ACCOUNT_1_ID,
        name: 'CharResultTest',
      });

      mockedAxios.get.mockImplementation((url: string) => {
        switch (url) {
          case `http://localhost:3000${PUBLIC_ROUTES.CharacterAttributes}`:
            return Promise.resolve<{
              data: Response_CharacterAttribute_GET_all;
            }>({
              data: {
                success: true,
                characterAttributes: [
                  {
                    characterAttributeId: '661f06d36689a6dc9807a9e1',
                    characterId: '661f06d36689a6dc9807a9d1',
                    addedValue: 0,
                    baseValue: 4,
                    statsAddedValue: 3,
                    totalValue: 7,
                    attributeId: '661f06d36689a6dc9807a9df',
                    attribute: {
                      attributeName: MainAttributeNames.HEALTH,
                      label: 'health',
                      isPercent: false,
                    },
                  },
                  {
                    characterAttributeId: '661f06d36689a6dc9808abcd',
                    characterId: '661f06d36689a6dc9807a9d1',
                    addedValue: 5,
                    baseValue: 5,
                    statsAddedValue: 0,
                    totalValue: 10,
                    attributeId: '661f06d36689a6dc9807abcd',
                    attribute: {
                      attributeName: MainAttributeNames.MAX_DAMAGE,
                      label: 'Maximal Damage',
                      isPercent: false,
                    },
                  },
                ],
              },
            });
          default:
            return Promise.resolve<any>({ data: [] });
        }
      });

      const adventureWithEnemy: Adventure = {
        ...ADVENTURES_MOCK[0],
        enemyIds: [1],
      };

      const adventure = await AdventureModel.create(adventureWithEnemy);

      const enemy: Enemy = {
        _id: 1,
        name: 'EnemyResultTest',
        type: EnemyTypes.DEMON,
        attributes: [
          {
            attributeName: MainAttributeNames.HEALTH,
            value: 15,
          },
          {
            attributeName: MainAttributeNames.MAX_DAMAGE,
            value: 40,
          },
        ],
      };

      await EnemyModel.create(enemy);

      const requestBody: Request_Result_POST_body = {
        adventureId: adventure.id,
        characterId: character.id,
      };
      await addResultToDb(RESULTS_MOCK);

      const resultsLength = await ResultModel.countDocuments();

      const res = await request(APP_SERVER).post(apiAddress).send(requestBody);

      const resultsNewLength = await ResultModel.countDocuments();

      expect(res.statusCode).toStrictEqual(201);
      expect(resultsNewLength).toEqual(resultsLength + 1);
      const resultResponse: Result_POST = res.body;
      expect(resultResponse.success).toStrictEqual(true);
      expect(resultResponse.result).toBeDefined();
      expect(resultResponse.result.resultId).toBeDefined();
      expect(resultResponse.result.timeStart).toBeDefined();
      expect(resultResponse.result.timeFinish).toBeDefined();
      const dateStartValue = new Date(
        resultResponse.result.timeStart
      ).valueOf();
      const dateFinishValue = new Date(
        resultResponse.result.timeFinish
      ).valueOf();
      console.log('dateStartValue: ', dateStartValue);
      console.log('dateFinishValue: ', dateFinishValue);
      expect(dateFinishValue - dateStartValue).toEqual(
        adventure.timeInSeconds * 1000
      );
    });
  });

  // describe(`GET ${apiAddress}/<REWARD_ID>`, () => {
  //   it('returns status code 200 with correct reward', async () => {
  //     await addResultToDb(REWARDS_MOCK);
  //     const reward2Id = REWARDS_MOCK[1]._id;
  //     const reward2currency = REWARDS_MOCK[1].currencies;

  //     const res = await request(APP_SERVER).get(`${apiAddress}/${reward2Id}`);

  //     expect(res.statusCode).toStrictEqual(200);
  //     const rewardResponse: Reward_GET_one = res.body;
  //     expect(rewardResponse.success).toStrictEqual(true);
  //     expect(rewardResponse.reward._id).toStrictEqual(reward2Id);
  //     expect(rewardResponse.reward.currencies).toStrictEqual(reward2currency);
  //   });

  //   it('returns status code 404 when reward ID is unknown', async () => {
  //     const unknownID = 199999;
  //     const res = await request(APP_SERVER).get(`${apiAddress}/${unknownID}`);

  //     expect(res.statusCode).toStrictEqual(404);
  //     const rewardResponse: Common_Response_Error = res.body;
  //     expect(rewardResponse.success).toStrictEqual(false);
  //     expect(rewardResponse.error).toStrictEqual(
  //       `Reward with id '${unknownID}' not found.`
  //     );
  //   });
  // });
});

async function addResultToDb(input: Result | Result[]) {
  return ResultModel.create(input);
}
