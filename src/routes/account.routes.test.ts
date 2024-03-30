import request from 'supertest';

import { AccountModel } from '../schema/account.schema';
import { APP_SERVER, unknownID } from '../tests/setupFile';
import { PUBLIC_ROUTES } from '../server';
import { Request_Account_POST_body, Request_Account_PATCH_body, Account_PATCH, Account_POST } from '../../../shared/src';
import { Common_Response_Error } from '../../../shared/src/interface/API/commonResponse';

describe('Account routes', () => {
  const apiAddress = PUBLIC_ROUTES.Accounts;

  afterEach(async () => {
    await AccountModel.deleteMany();
  });

  describe(`POST ${apiAddress}`, () => {
    it('creates new account with status code 201', async () => {
      const newAccEmail = 'test@test.test';
      const newAccUsername = 'Test_Username';
      const newAccPassword = '123'

      await addAccountToDb('acc2@test.test', 'testAccount2', '12345');
      const currentLength = await AccountModel.countDocuments();

      const res = await request(APP_SERVER).post(apiAddress).send(<Request_Account_POST_body>{ email: newAccEmail, username: newAccUsername, password: newAccPassword });

      const newLength = await AccountModel.countDocuments();

      expect(newLength).toBe(currentLength + 1);
      expect(res.statusCode).toEqual(201);
      const accountResponse: Account_POST = res.body;
      expect(accountResponse.success).toBe(true);
      expect(accountResponse.account.accountId).toBeDefined();
      expect(accountResponse.account.email).toBe(newAccEmail);
      expect(accountResponse.account.username).toBe(newAccUsername);
    });
  })

  describe(`PATCH ${apiAddress}/<ACCOUNT_ID>`, () => {
    it('adds character to the account and returns 200', async () => {
      const addedAccount = await addAccountToDb('acc@test.test', 'testAccount', '12345');
      const addedAccountId: string = addedAccount.id;
      const newCharId = unknownID;
      const currentAccCharsLength = addedAccount.characters.length;

      const res = await request(APP_SERVER).patch(`${apiAddress}/${addedAccountId}`).send(<Request_Account_PATCH_body>{ characterId: newCharId.toString() });

      const account = await AccountModel.findById(addedAccountId);
      const newAccCharsLength = account!.characters.length;

      expect(res.statusCode).toEqual(200);
      const accountResponse: Account_PATCH = res.body;
      expect(accountResponse.success).toBe(true);
      expect(newAccCharsLength).toBe(currentAccCharsLength + 1);
      expect(accountResponse.account.accountId).toBe(addedAccountId);
    })

    it('returns 404 when account ID doesnt exists in database', async () => {
      const requestBody: Request_Account_PATCH_body = {
        characterId: unknownID.toString()
      }

      const res = await request(APP_SERVER).patch(`${apiAddress}/${unknownID}`).send(requestBody);

      expect(res.statusCode).toEqual(404);
      const characterResponse: Common_Response_Error = res.body;
      expect(characterResponse.success).toBe(false);
      expect(characterResponse.error).toBe(`Account with id '${unknownID}' not found`);
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