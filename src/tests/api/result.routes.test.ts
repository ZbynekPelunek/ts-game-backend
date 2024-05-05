import request from 'supertest';
import {
  describe,
  afterEach,
  it,
  expect,
  xit,
  beforeAll,
  afterAll,
} from '@jest/globals';

import {
  Adventure,
  Enemy,
  EnemyTypes,
  MainAttributeNames,
  Request_Result_GET_all_query,
  Request_Result_GET_one_params,
  Request_Result_POST_body,
  Response_Adventure_GET_one,
  Response_Character_GET_one,
  Response_CharacterAttribute_GET_all,
  Result_GET_all,
  Result_GET_one,
  Result_POST,
  ResultBackend,
} from '../../../../shared/src';
import { RESULTS_MOCK, RESULTS_MOCK_CHARACTERID } from '../../mockData/results';
import { APP_SERVER, mockedAxios, UNKNOWN_OBJECT_ID } from '../setupFile';
import { ADVENTURES_MOCK } from '../../mockData/adventures';
import { EnemyModel } from '../../models/enemy.model';
import { ResultModel } from '../../models/result.model';
import { FULL_PUBLIC_ROUTES, PUBLIC_ROUTES } from '../../services/api.service';
import { Document } from 'mongoose';
import { Common_Response_Error } from '../../../../shared/src/interface/API/commonResponse';

describe('Result routes', () => {
  const apiAddress = PUBLIC_ROUTES.Results;

  afterEach(async () => {
    await ResultModel.deleteMany();
    await EnemyModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all Results', async () => {
      await addResultToDb(RESULTS_MOCK);

      const resultsLength = await ResultModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toStrictEqual(200);
      const resultResponse: Result_GET_all = res.body;
      expect(resultResponse.success).toStrictEqual(true);
      expect(resultResponse.results).toHaveLength(resultsLength);
    });

    it('returns status code 200 with Results limited to 2', async () => {
      const limit = 2;
      const queryString: Request_Result_GET_all_query = {
        limit,
      };
      await addResultToDb(RESULTS_MOCK);

      const res = await request(APP_SERVER).get(apiAddress).query(queryString);

      expect(res.statusCode).toEqual(200);
      const adventuresResponse: Result_GET_all = res.body;
      expect(adventuresResponse.success).toBe(true);
      expect(adventuresResponse.results).toHaveLength(limit);
    });
  });

  describe(`GET ${apiAddress}/<RESULT_ID>`, () => {
    it('returns status code 200 with correct Result', async () => {
      const results = (await addResultToDb(
        RESULTS_MOCK
      )) as Document<ResultBackend>[];
      const result2Id = results[1].id;

      const res = await request(APP_SERVER).get(`${apiAddress}/${result2Id}`);

      expect(res.statusCode).toStrictEqual(200);
      const resultResponse: Result_GET_one = res.body;
      expect(resultResponse.success).toStrictEqual(true);
      expect(resultResponse.result.characterId).toBe(
        RESULTS_MOCK_CHARACTERID.toString()
      );
    });

    it('returns status code 404 when Result ID is unknown', async () => {
      const unknownID = UNKNOWN_OBJECT_ID.toString();
      const res = await request(APP_SERVER).get(`${apiAddress}/${unknownID}`);

      expect(res.statusCode).toStrictEqual(404);
      const resultResponse: Common_Response_Error = res.body;
      expect(resultResponse.success).toStrictEqual(false);
      expect(resultResponse.error).toStrictEqual(
        `Result with id '${unknownID}' not found`
      );
    });
  });

  describe(`POST ${apiAddress}`, () => {
    const characterId = UNKNOWN_OBJECT_ID;
    const adventureNoEnemy = ADVENTURES_MOCK[0];
    const adventureWithEnemy: Adventure = {
      ...ADVENTURES_MOCK[1],
      enemyIds: [1],
    };

    beforeAll(() => {
      mockedAxios.get.mockImplementation((url: string) => {
        switch (url) {
          case FULL_PUBLIC_ROUTES.CharacterAttributes:
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
          case `${FULL_PUBLIC_ROUTES.Characters}/${characterId}`:
            return Promise.resolve<{
              data: Response_Character_GET_one;
            }>({
              data: {
                success: true,
                character: {
                  name: 'ResultTest',
                  accountId: '',
                  characterId: '',
                },
              },
            });
          case `${FULL_PUBLIC_ROUTES.Adventures}/${adventureNoEnemy._id}`:
            return Promise.resolve<{
              data: Response_Adventure_GET_one;
            }>({
              data: {
                success: true,
                adventure: {
                  ...adventureNoEnemy,
                },
              },
            });
          case `${FULL_PUBLIC_ROUTES.Adventures}/${adventureWithEnemy._id}`:
            return Promise.resolve<{
              data: Response_Adventure_GET_one;
            }>({
              data: {
                success: true,
                adventure: {
                  ...adventureWithEnemy,
                },
              },
            });
          default:
            return Promise.resolve<any>({ data: [] });
        }
      });
    });

    afterAll(() => {
      mockedAxios.get.mockClear();
    });

    it('returns status code 201 with created Result with NO combat (adventure without enemy)', async () => {
      const requestBody: Request_Result_POST_body = {
        adventureId: adventureNoEnemy._id,
        characterId: characterId.toString(),
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
      expect(dateFinishValue - dateStartValue).toEqual(
        adventureNoEnemy.timeInSeconds * 1000
      );
    });

    it('returns status code 201 with created Result with combat (adventure with an enemy)', async () => {
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
        adventureId: adventureWithEnemy._id,
        characterId: characterId.toString(),
      };
      await addResultToDb(RESULTS_MOCK);

      const resultsLength = await ResultModel.countDocuments();

      const res = await request(APP_SERVER).post(apiAddress).send(requestBody);
      console.log(res.body);

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
      expect(dateFinishValue - dateStartValue).toEqual(
        adventureWithEnemy.timeInSeconds * 1000
      );
    });
  });
});

async function addResultToDb(
  input: ResultBackend | ResultBackend[]
): Promise<Document | Document[]> {
  return ResultModel.create(input);
}
