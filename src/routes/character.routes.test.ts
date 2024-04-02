import request from 'supertest';
import { describe, afterEach, it, expect } from '@jest/globals';

import { CharacterModel } from '../schema/character.schema';
import {
  CharacterBackend,
  Character_GET_All,
  Character_GET_one,
  Character_POST,
  Response_Attribute_GET_all
} from '../../../shared/src';
import { APP_SERVER, mockedAxios, unknownID } from '../tests/setupFile';
import { PUBLIC_ROUTES } from '../server';

describe('Character routes', () => {
  const accountId = unknownID;
  const characterName = 'TEST CHAR';
  const apiAddress = PUBLIC_ROUTES.Characters;

  afterEach(async () => {
    await CharacterModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns all characters with status code 200', async () => {
      await addCharacterToDb(characterName);

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const charactersResponse: Character_GET_All = res.body;
      expect(charactersResponse.success).toBe(true);
      expect(charactersResponse.characters).toHaveLength(1);
      expect(charactersResponse.characters[0].name).toBe(characterName);
      expect(charactersResponse.characters[0].accountId).toBe(
        accountId.toString()
      );
    });
  });

  describe(`POST ${apiAddress}`, () => {
    it('creates new character with status code 201', async () => {
      const newCharName = 'Added Char';

      await addCharacterToDb(characterName);
      const currentLength = await CharacterModel.countDocuments();

      const res = await request(APP_SERVER)
        .post(apiAddress)
        .send({ accountId: accountId.toString(), name: newCharName });
      console.log('Char POST response: ', res.body);

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
      expect(characterResponse.character.characterAttributes).toEqual([]);
      expect(characterResponse.character.currencyIds).toEqual([]);
      expect(characterResponse.character.equipment).toEqual([]);
      expect(characterResponse.character.inventory).toEqual([]);
    });

    it('returns 500 when getting attributes fails', async () => {
      const newCharName = 'Added Char 2';

      mockedAxios.get.mockImplementationOnce((url: string) => {
        if (url === 'http://localhost:3000/api/v1/attributes') {
          return Promise.resolve<{
            data: Response_Attribute_GET_all;
          }>({
            data: { success: false, error: 'error' }
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    it('returns 500 when chararacter attributes fails', async () => {
      const newCharName = 'Added Char 3';

      mockedAxios.post.mockImplementationOnce(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Promise.resolve<any>({ data: { success: false } })
      );

      const res = await request(APP_SERVER)
        .post(apiAddress)
        .send({ accountId: accountId.toString(), name: newCharName });

      const newLength = await CharacterModel.countDocuments();

      expect(newLength).toBe(0);
      expect(res.statusCode).toEqual(500);
      const characterResponse = res.body;
      expect(characterResponse.success).toBe(false);
    });
  });

  describe(`GET ${apiAddress}/<CHARACTER_ID>`, () => {
    it('returns single character with status code 200', async () => {
      const addedCharacter = await addCharacterToDb(characterName);
      const addedCharacterId = addedCharacter.id;

      const res = await request(APP_SERVER).get(
        `${apiAddress}/${addedCharacterId}`
      );

      expect(res.statusCode).toEqual(200);
      const characterResponse: Character_GET_one = res.body;
      expect(characterResponse.success).toBe(true);
      expect(characterResponse.character.name).toBe(characterName);
      expect(characterResponse.character.accountId).toBe(accountId.toString());
    });

    it('returns 404 when character ID unknown', async () => {
      const res = await request(APP_SERVER).get(`${apiAddress}/${unknownID}`);

      expect(res.statusCode).toEqual(404);
      const characterResponse = res.body;
      expect(characterResponse.success).toBe(false);
      expect(characterResponse.error).toBe(
        `Character with id '${unknownID}' not found`
      );
    });
  });
});

async function addCharacterToDb(name: string, accountId = unknownID) {
  const character = new CharacterModel<CharacterBackend>({
    accountId,
    name
  });
  return await character.save();
}
