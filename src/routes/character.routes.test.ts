import request from 'supertest';
import { CharacterModel } from '../schema/character.schema';
import { AppServer } from '../server';
import { Express } from 'express-serve-static-core';
import { Characters_GET_All, Characters_GET_one, Characters_POST } from '../../../shared/src';
import { AccountModel } from '../schema/account.schema';

describe("Character routes", () => {
  let appServer: AppServer;
  let app: Express;
  let accountId: string;
  const characterName = 'TEST CHAR';
  const apiAddress = '/api/v1/characters';

  beforeAll(async () => {
    appServer = new AppServer();
    appServer.start();
    appServer.setupRouters();
    app = appServer.getApp();

    const account = new AccountModel({
      email: 'testing@test.test',
      password: 123,
      username: 'TESTER_DELETE_ME'
    })

    account.save();
    accountId = account.id;
  })

  afterEach(async () => {
    await CharacterModel.deleteMany();
  })

  afterAll(async () => {
    await AccountModel.deleteMany();
    await appServer.destroy();
  })

  describe(`GET ${apiAddress}`, () => {
    it('returns all characters with status code 200', async () => {
      await addCharacterToDb(accountId, characterName);

      const res = await request(app).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const charactersResponse: Characters_GET_All = res.body;
      expect(charactersResponse.success).toBe(true);
      expect(charactersResponse.characters).toHaveLength(1);
      expect(charactersResponse.characters[0].name).toBe(characterName);
      expect(charactersResponse.characters[0].accountId).toBe(accountId.toString());
    });
  })

  describe(`POST ${apiAddress}`, () => {
    it('creates new character with status code 201', async () => {
      const newCharName = 'Added Char';

      await addCharacterToDb(accountId, characterName);
      const currentLength = await CharacterModel.countDocuments();

      const res = await request(app).post(apiAddress).send({ accountId, name: newCharName });

      const newLength = await CharacterModel.countDocuments();

      expect(newLength).toBe(currentLength + 1);
      expect(res.statusCode).toEqual(201);
      const characterResponse: Characters_POST = res.body;
      expect(characterResponse.success).toBe(true);
      expect(characterResponse.character.name).toBe(newCharName);
    });
  })

  describe(`GET ${apiAddress}/<CHARACTER_ID>`, () => {
    it('returns single character with status code 200', async () => {
      const addedCharacter = await addCharacterToDb(accountId, characterName);
      const addedCharacterId = addedCharacter.id;

      const res = await request(app).get(`${apiAddress}/${addedCharacterId}`);

      expect(res.statusCode).toEqual(200);
      const characterResponse: Characters_GET_one = res.body;
      expect(characterResponse.success).toBe(true);
      expect(characterResponse.character.name).toBe(characterName);
      expect(characterResponse.character.accountId).toBe(accountId);
    })
  })
});

async function addCharacterToDb(accountId: string, name: string) {
  const character = new CharacterModel({
    accountId,
    name
  })
  return await character.save();
}