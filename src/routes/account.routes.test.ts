import request from 'supertest';
import { Accounts_POST, Accounts_POST_Characters, Request_Account_POST_Characters_body, Request_Account_POST_body, Response_Account_POST_Characters } from '../../../shared/src';
import { AccountModel } from '../schema/account.schema';
import { APP_SERVER, unknownID } from '../tests/setupFile';
import { Common_Response_Error } from '../../../shared/src/interface/api-response/common';

describe('Account routes', () => {
  const apiAddress = '/api/v1/accounts';

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
      const addedAccountId: string = addedAccount.id;
      const newCharId = unknownID;
      const currentAccCharsLength = addedAccount.characters.length;

      const res = await request(APP_SERVER).post(`${apiAddress}/${addedAccountId}/characters`).send(<Request_Account_POST_Characters_body>{ characterId: newCharId.toString() });

      const account = await AccountModel.findById(addedAccountId);
      const newAccCharsLength = account!.characters.length;

      expect(res.statusCode).toEqual(201);
      const accountResponse: Accounts_POST_Characters = res.body;
      expect(accountResponse.success).toBe(true);
      expect(newAccCharsLength).toBe(currentAccCharsLength + 1);
      expect(accountResponse.account.accountId).toBe(addedAccountId);
    })

    it('returns 404 when account ID doesnt exists in database', async () => {
      const res = await request(APP_SERVER).post(`${apiAddress}/${unknownID}/characters`).send(<Request_Account_POST_Characters_body>{ characterId: unknownID.toString() });

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