import { Request, Response, Router } from 'express';
import { Types } from 'mongoose';

import { AccountModel } from '../schema/account.schema';
import {
  Request_Account_POST_body,
  Response_Account_POST,
  Request_Account_PATCH_params,
  Request_Account_PATCH_body,
  Response_Account_PATCH
} from '../../../shared/src';

export const accountsRouter = Router();

accountsRouter.post(
  '',
  async (
    req: Request<object, object, Request_Account_POST_body>,
    res: Response<Response_Account_POST>
  ) => {
    const { email, password, username } = req.body;

    const account = new AccountModel({
      email,
      password,
      username
    });

    await account.save();

    return res.status(201).json({
      success: true,
      account: {
        accountId: account.id,
        email: account.email,
        username: account.username
      }
    });
  }
);

accountsRouter.patch(
  '/:accountId',
  async (
    req: Request<
      Request_Account_PATCH_params,
      object,
      Request_Account_PATCH_body
    >,
    res: Response<Response_Account_PATCH>
  ) => {
    const { accountId } = req.params;
    const { characterId } = req.body;

    // TODO: Object ID validator
    // if (validateObjectId(accountId)) {
    //   return res.status(400).json({ success: false, error: 'Account ID is invalid' });
    // }

    // if (validateObjectId(characterId)) {
    //   return res.status(400).json({ success: false, error: 'Character ID is invalid' });
    // }

    const account = await AccountModel.findById(accountId);

    if (!account) {
      console.log('no account found');

      // TODO: fix NotFoundError to return 404
      //throw new NotFoundError(`Account with id '${accountId}' not found`);
      return res.status(404).json({
        success: false,
        error: `Account with id '${accountId}' not found`
      });
    }

    const convertCharacterId = new Types.ObjectId(characterId);

    account.characters.push(convertCharacterId);
    await account.save();

    return res.status(200).json({
      success: true,
      account: { accountId: account.id }
    });
  }
);
