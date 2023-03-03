import express, { Request, Response } from 'express';

import { AccountModel } from '../schema/account';

export const accountsRouter = express.Router();

accountsRouter.post('', async (req: Request, res: Response) => {
  const accountBody = req.body;
  const account = new AccountModel({
    email: accountBody.email,
    password: accountBody.password,
    username: accountBody.username
  });
  await account.save();
  return res.status(200).json(
    account
  );
})