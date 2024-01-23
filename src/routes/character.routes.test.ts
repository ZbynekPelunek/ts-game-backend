import request from "supertest";
import { CharacterModel } from '../schema/character.schema';
import { AppServer } from '../server';
import { Express } from 'express-serve-static-core';
import { Characters_GET_All, Characters_POST, Response_Characters_POST } from '../../../shared/src';
import { AccountModel } from '../schema/account.schema';

describe("Character routes", () => {
  let appServer: AppServer;
  let app: Express;
  let accountId: string;
  const characterName = 'TEST CHAR';

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
    await CharacterModel.deleteMany({});
  })

  afterAll(async () => {
    await AccountModel.deleteMany({});
    await appServer.destroy();
  })

  it('GET returns all characters', async () => {
    await addCharacterToDb(accountId, characterName);

    const res = await request(app).get('/api/v1/characters');

    expect(res.statusCode).toEqual(200);
    const charactersResponse: Characters_GET_All = res.body;
    expect(charactersResponse.success).toBe(true);
    expect(charactersResponse.characters).toHaveLength(1);
    expect(charactersResponse.characters[0].name).toBe(characterName);
    expect(charactersResponse.characters[0].accountId).toBe(accountId.toString());
  });

  it('POST creates new character', async () => {
    const newCharName = 'Added Char';

    await addCharacterToDb(accountId, characterName);
    const currentLength = await CharacterModel.countDocuments();

    const res = await request(app).post('/api/v1/characters').send({ accountId, name: newCharName });

    const newLength = await CharacterModel.countDocuments();

    expect(newLength).toBe(currentLength + 1);
    expect(res.statusCode).toEqual(201);
    const characterResponse: Characters_POST = res.body;
    expect(characterResponse.success).toBe(true);
    expect(characterResponse.character.name).toBe(newCharName);
  })
});

async function addCharacterToDb(accountId: string, name: string): Promise<void> {
  const character = new CharacterModel({
    accountId,
    name
  })
  await character.save();
}