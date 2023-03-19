import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { AccountModel } from '../schema/account';

export const accountsRouter = express.Router();

accountsRouter.post('', async (req: Request, res: Response) => {
  const accountBody = req.body;
  const account = new AccountModel({
    _id: uuidv4(),
    email: accountBody.email,
    password: accountBody.password,
    username: accountBody.username,
    characters: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    level: 0
  });
  await account.save();
  return res.status(200).json(
    account
  );
})