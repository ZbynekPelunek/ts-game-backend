import express, { Request, Response } from 'express';
import { Types } from 'mongoose';

import { Request_Account_POST, Response_Account_POST } from '../../../shared/src';
import { NotFoundError } from '../errors/not-found-error';
import { AccountModel } from '../schema/account.schema';

export const accountsRouter = express.Router();

accountsRouter.post('', async (req: Request<{}, {}, Request_Account_POST>, res: Response<Response_Account_POST>) => {
  const accountBody = req.body;

  const account = new AccountModel({
    email: accountBody.email,
    password: accountBody.password,
    username: accountBody.username
  });

  await account.save();

  return res.status(201).json(
    { accountId: account._id }
  );
});

accountsRouter.post('/:accountId/characters', async (req: Request<{ accountId: Types.ObjectId }, {}, { characterId: Types.ObjectId }>, res: Response) => {
  const accountId = req.params.accountId;
  const characterId = req.body.characterId;

  const account = await AccountModel.findById(accountId);

  if (!account) {
    throw new NotFoundError(`Account witd id '${accountId}' not found`);
  }

  account.characters.push({ _id: characterId })
  account.save();

  return res.status(201).json(
    {
      success: true,
      account
    }
  );
})