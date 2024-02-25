import request from 'supertest';
import { AppServer } from '../server';
import { Express } from 'express-serve-static-core';
import { Accounts_POST, Accounts_POST_Characters, Request_Account_POST_Characters_body, Request_Account_POST_body } from '../../../shared/src';
import { AccountModel } from '../schema/account.schema';
import { Types } from 'mongoose';

describe("Character routes", () => {
  let appServer: AppServer;
  let app: Express;
  const apiAddress = '/api/v1/accounts';

  beforeAll(async () => {
    appServer = new AppServer();
    appServer.start();
    appServer.setupRouters();
    app = appServer.getApp();
  })

  afterEach(async () => {
    await AccountModel.deleteMany();
  })

  afterAll(async () => {
    await appServer.destroy();
  })

  describe(`POST ${apiAddress}`, () => {
    it('creates new account with status code 201', async () => {
      const newAccEmail = 'test@test.test';
      const newAccUsername = 'Test_Username';
      const newAccPassword = '123'

      await addAccountToDb('acc2@test.test', 'testAccount2', '12345');
      const currentLength = await AccountModel.countDocuments();

      const res = await request(app).post(apiAddress).send(<Request_Account_POST_body>{ email: newAccEmail, username: newAccUsername, password: newAccPassword });

      const newLength = await AccountModel.countDocuments();

      expect(newLength).toBe(currentLength + 1);
      expect(res.statusCode).toEqual(201);
      const accountResponse: Accounts_POST = res.body;
      expect(accountResponse.success).toBe(true);
      expect(accountResponse.account.accountId).toBeDefined();
      expect(accountResponse.account.email).toBe(newAccEmail);
      expect(accountResponse.account.username).toBe(newAccUsername);
    });
  })

  describe(`POST ${apiAddress}/<ACCOUNT_ID>/characters`, () => {
    it('adds character to the account and returns 201', async () => {
      const addedAccount = await addAccountToDb('acc@test.test', 'testAccount', '12345');
      const addedAccountId = addedAccount.id;
      const newCharId = new Types.ObjectId;
      const currentAccCharsLength = addedAccount.characters.length;

      const res = await request(app).post(`${apiAddress}/${addedAccountId}/characters`).send(<Request_Account_POST_Characters_body>{ characterId: newCharId.toString() });

      const account = await AccountModel.findById(addedAccountId);
      const newAccCharsLength = account!.characters.length;

      expect(res.statusCode).toEqual(201);
      const characterResponse: Accounts_POST_Characters = res.body;
      expect(characterResponse.success).toBe(true);
      expect(newAccCharsLength).toBe(currentAccCharsLength + 1);
      expect(characterResponse.account.accountId).toBe(addedAccountId);
    })
  })
});

async function addAccountToDb(email: string, username: string, password: string) {
  const account = new AccountModel({
    email,
    password,
    username
  })

  return await account.save();
}