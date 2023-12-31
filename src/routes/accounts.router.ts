import { Request, Response, Router } from 'express';
import { Types } from 'mongoose';

import {
  Request_Account_POST,
  Request_Account_POST_Characters_body,
  Request_Account_POST_Characters_params,
  Response_Account_POST,
  Response_Account_POST_Characters,
} from '../../../shared/src';
import { NotFoundError } from '../errors/not-found-error';
import { AccountModel } from '../schema/account.schema';

export const accountsRouter = Router();

accountsRouter.post('', async (req: Request<{}, {}, Request_Account_POST>, res: Response<Response_Account_POST>) => {
  const accountBody = req.body;

  const account = new AccountModel({
    email: accountBody.email,
    password: accountBody.password,
    username: accountBody.username
  });

  await account.save();

  return res.status(201).json(
    {
      success: true,
      account: { accountId: account.id }
    }
  );
});

accountsRouter.post('/:accountId/characters', async (req: Request<Request_Account_POST_Characters_params, {}, Request_Account_POST_Characters_body>, res: Response<Response_Account_POST_Characters>) => {
  const accountId = req.params.accountId;
  const characterId = req.body.characterId;

  const account = await AccountModel.findById(accountId);

  if (!account) {
    throw new NotFoundError(`Account witd id '${accountId}' not found`);
  }

  const convertCharacterId = new Types.ObjectId(characterId);

  account.characters.push(convertCharacterId);
  await account.save();

  return res.status(201).json(
    {
      success: true,
      account: { accountId: account.id }
    }
  );
})