import request from 'supertest';
import { describe, afterEach, it, expect } from '@jest/globals';

import { APP_SERVER } from '../tests/setupFile';
import { PUBLIC_ROUTES } from '../server';
import {
  Request_Account_POST_body,
  Account_POST,
  IAccountSchema,
} from '../../../shared/src';
import { AccountModel } from '../models/account.model';

describe('Account routes', () => {
  const apiAddress = PUBLIC_ROUTES.Accounts;

  afterEach(async () => {
    await AccountModel.deleteMany();
  });

  describe(`POST ${apiAddress}`, () => {
    it('creates new account with status code 201', async () => {
      const newAccEmail = 'test@test.test';
      const newAccUsername = 'Test_Username';
      const newAccPassword = '123';

      await addAccountToDb({
        email: 'acc@test.test',
        username: 'testAccount',
        password: '12345',
      });
      const currentLength = await AccountModel.countDocuments();

      const requestNewAccountBody: Request_Account_POST_body = {
        email: newAccEmail,
        username: newAccUsername,
        password: newAccPassword,
      };

      const res = await request(APP_SERVER)
        .post(apiAddress)
        .send(requestNewAccountBody);

      const newLength = await AccountModel.countDocuments();

      expect(newLength).toBe(currentLength + 1);
      expect(res.statusCode).toEqual(201);
      const accountResponse: Account_POST = res.body;
      expect(accountResponse.success).toBe(true);
      expect(accountResponse.account.id).toBeDefined();
      expect(accountResponse.account.email).toBe(newAccEmail);
      expect(accountResponse.account.username).toBe(newAccUsername);
    });
  });

  // TODO: refactor to update account information
  /*   describe(`PATCH ${apiAddress}/<ACCOUNT_ID>`, () => {
    it('adds character to the account and returns 200', async () => {
      const addedAccount = await addAccountToDb({
        email: 'acc@test.test',
        username: 'testAccount',
        password: '12345',
      });
      const addedAccountId = addedAccount.id;
      const newCharId = UNKNOWN_OBJECT_ID.toString();
      const currentAccCharsLength = addedAccount.characters!.length;

      const requestAccountBody: Request_Account_PATCH_body = {
        characterId: newCharId,
      };

      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${addedAccountId}`)
        .send(requestAccountBody);

      const account = await AccountModel.findById(addedAccountId);
      const newAccCharsLength = account!.characters!.length;

      expect(res.statusCode).toEqual(200);
      const accountResponse: Account_PATCH = res.body;
      expect(accountResponse.success).toBe(true);
      expect(newAccCharsLength).toBe(currentAccCharsLength + 1);
      expect(accountResponse.account.id).toBe(addedAccountId);
    });

    it('returns 404 when account ID doesnt exists in database', async () => {
      const requestAccountBody: Request_Account_PATCH_body = {
        characterId: UNKNOWN_OBJECT_ID.toString(),
      };

      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${UNKNOWN_OBJECT_ID}`)
        .send(requestAccountBody);

      expect(res.statusCode).toEqual(404);
      const characterResponse: Common_Response_Error = res.body;
      expect(characterResponse.success).toBe(false);
      expect(characterResponse.error).toBe(
        `Account with id '${UNKNOWN_OBJECT_ID}' not found`
      );
    });
  }); */
});

async function addAccountToDb(input: IAccountSchema | IAccountSchema[]) {
  return AccountModel.create(input);
}
