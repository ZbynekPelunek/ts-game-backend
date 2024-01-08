import request from "supertest";
import { Types } from 'mongoose';
import { CharacterModel } from '../schema/character.schema';
import { AppServer } from '../server';
import { Express } from 'express-serve-static-core';
import { Characters_GET_All } from '../../../shared/src';

describe("Character routes", () => {
  let appServer: AppServer;
  let app: Express;
  const characterName = 'TEST CHAR';
  const accountId = new Types.ObjectId();

  beforeAll(async () => {
    appServer = new AppServer();
    appServer.setupRouters();
    app = appServer.getApp();

    const character = new CharacterModel({
      accountId,
      name: characterName
    })
    await character.save();
  })

  afterEach(async () => {
    await CharacterModel.deleteMany({});
  })

  afterAll(async () => {
    await appServer.destroy();
  })

  it("Get all characters", async () => {
    const res = await request(app).get("/api/v1/characters");
    expect(res.statusCode).toEqual(200);
    const charactersResponse: Characters_GET_All = res.body;
    expect(charactersResponse.success).toBe(true);
    expect(charactersResponse.characters).toHaveLength(1);
    expect(charactersResponse.characters[0].name).toBe(characterName);
    expect(charactersResponse.characters[0].accountId).toBe(accountId.toString());
  });

});
