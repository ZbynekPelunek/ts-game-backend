import request from 'supertest';
import {
  describe,
  afterEach,
  it,
  expect,
  xit,
  jest,
  beforeAll,
} from '@jest/globals';

import {
  CharacterBackend,
  Character_GET_All,
  Character_GET_one,
  Character_POST,
  Request_Character_GET_all_query,
  Request_Character_POST_body,
  Response_Attribute_GET_all,
} from '../../../../shared/src';
import { APP_SERVER, mockedAxios, UNKNOWN_OBJECT_ID } from '../setupFile';
import { CHARACTERS_MOCK } from '../../mockData/characters';
import { CharacterModel } from '../../models/character.model';
import { FULL_PUBLIC_ROUTES, PUBLIC_ROUTES } from '../../services/api.service';

describe('Character routes', () => {
  const accountId = UNKNOWN_OBJECT_ID;
  const apiAddress = PUBLIC_ROUTES.Characters;

  afterEach(async () => {
    await CharacterModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all characters', async () => {
      await addCharacterToDb(CHARACTERS_MOCK);

      const charactersLength = await CharacterModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const charactersResponse: Character_GET_All = res.body;
      expect(charactersResponse.success).toBe(true);
      expect(charactersResponse.characters).toHaveLength(charactersLength);
    });

    it('returns status code 200 with all characters filtered by accountId', async () => {
      const character1AccountId = CHARACTERS_MOCK[0].accountId;
      await addCharacterToDb(CHARACTERS_MOCK);

      const charactersLength = await CharacterModel.countDocuments({
        accountId: character1AccountId,
      });

      const requestQuery: Request_Character_GET_all_query = {
        accountId: character1AccountId.toString(),
      };
      const res = await request(APP_SERVER).get(apiAddress).query(requestQuery);

      expect(res.statusCode).toEqual(200);
      const charactersResponse: Character_GET_All = res.body;
      expect(charactersResponse.success).toBe(true);
      expect(charactersResponse.characters).toHaveLength(charactersLength);
    });
  });

  describe(`POST ${apiAddress}`, () => {
    it('returns status code 201 with created character', async () => {
      const newCharName = 'Added Char';

      await addCharacterToDb(CHARACTERS_MOCK);
      const currentLength = await CharacterModel.countDocuments();

      const requestBody: Request_Character_POST_body = {
        accountId: accountId.toString(),
        name: newCharName,
      };

      const res = await request(APP_SERVER).post(apiAddress).send(requestBody);

      const newLength = await CharacterModel.countDocuments();

      expect(res.statusCode).toEqual(201);
      expect(newLength).toBe(currentLength + 1);
      const characterResponse: Character_POST = res.body;
      expect(characterResponse.success).toBe(true);
      expect(characterResponse.character.name).toBe(newCharName);
      expect(characterResponse.character.maxExperience).toBe(200);
      expect(characterResponse.character.level).toBe(1);
      expect(characterResponse.character.currentExperience).toBe(0);
      expect(characterResponse.character.adventures).toEqual([]);
    });

    it('returns status code 500 when getting attributes fails', async () => {
      const newCharName = 'Added Char 2';

      mockedAxios.get.mockImplementationOnce((url: string) => {
        if (url === FULL_PUBLIC_ROUTES.Attributes) {
          return Promise.resolve<{
            data: Response_Attribute_GET_all;
          }>({
            data: { success: false, error: 'error' },
          });
        }
        return Promise.resolve<any>({ data: { success: false } });
      });

      const res = await request(APP_SERVER)
        .post(apiAddress)
        .send({ accountId: accountId.toString(), name: newCharName });

      const newLength = await CharacterModel.countDocuments();

      expect(newLength).toBe(0);
      expect(res.statusCode).toEqual(500);
      const characterResponse = res.body;
      expect(characterResponse.success).toBe(false);
    });

    it('returns status code 500 when character attributes fails', async () => {
      const newCharName = 'Added Char 3';

      mockedAxios.post.mockImplementationOnce(() =>
        Promise.resolve<any>({ data: { success: false } })
      );

      const requestBody: Request_Character_POST_body = {
        accountId: accountId.toString(),
        name: newCharName,
      };

      const res = await request(APP_SERVER).post(apiAddress).send(requestBody);

      const newLength = await CharacterModel.countDocuments();

      expect(newLength).toBe(0);
      expect(res.statusCode).toEqual(500);
      const characterResponse = res.body;
      expect(characterResponse.success).toBe(false);
    });
  });

  describe(`GET ${apiAddress}/<CHARACTER_ID>`, () => {
    it('returns status code 200 with a single character', async () => {
      const addedCharacters = await addCharacterToDb(CHARACTERS_MOCK);
      let addedCharacter1Id;
      if (Array.isArray(addedCharacters)) {
        addedCharacter1Id = addedCharacters[0].id;
      }
      const addedCharacter1Name = CHARACTERS_MOCK[0].name;
      const addedCharacter1AccountId = CHARACTERS_MOCK[0].accountId;

      const res = await request(APP_SERVER).get(
        `${apiAddress}/${addedCharacter1Id}`
      );

      expect(res.statusCode).toEqual(200);
      const characterResponse: Character_GET_one = res.body;
      expect(characterResponse.success).toBe(true);
      expect(characterResponse.character.characterId).toBe(addedCharacter1Id);
      expect(characterResponse.character.name).toBe(addedCharacter1Name);
      expect(characterResponse.character.accountId).toBe(
        addedCharacter1AccountId.toString()
      );
    });

    it('returns status code 404 when character ID unknown', async () => {
      const res = await request(APP_SERVER).get(
        `${apiAddress}/${UNKNOWN_OBJECT_ID}`
      );

      expect(res.statusCode).toEqual(404);
      const characterResponse = res.body;
      expect(characterResponse.success).toBe(false);
      expect(characterResponse.error).toBe(
        `Character with id '${UNKNOWN_OBJECT_ID}' not found`
      );
    });
  });
});

async function addCharacterToDb(input: CharacterBackend | CharacterBackend[]) {
  return CharacterModel.create(input);
}
