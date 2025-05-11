import { Request, Response } from 'express-serve-static-core';

import {
  CreateAccountRequestDTO,
  CreateAccountResponse,
  DeleteAccountRequestParams,
  DeleteAccountResponse,
  GetAccountRequestParams,
  GetAccountResponse,
  ListAccountsResponse,
  UpdateAccountRequestDTO,
  UpdateAccountRequestParams,
  UpdateAccountResponse
} from '../../../shared/src';
import { AccountService } from '../services/account.service';

export class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  async list(_req: Request, res: Response<ListAccountsResponse>) {
    const accounts = await this.accountService.list();

    res.status(200).json({
      success: true,
      accounts: accounts.map((acc) => {
        return {
          _id: acc._id.toString()
        };
      })
    });
  }

  async get(
    req: Request<GetAccountRequestParams>,
    res: Response<GetAccountResponse>
  ) {
    const { accountId } = req.params;

    const account = await this.accountService.getById(accountId);

    res.status(200).json({
      success: true,
      account: {
        _id: account._id.toString()
      }
    });
  }

  async create(
    req: Request<{}, {}, CreateAccountRequestDTO>,
    res: Response<CreateAccountResponse>
  ) {
    const { email, password, username } = req.body;

    const { createdAccount } = await this.accountService.create({
      email,
      password,
      username
    });

    res.status(201).json({
      success: true,
      account: {
        _id: createdAccount._id,
        email: createdAccount.email,
        username: createdAccount.username
      }
    });
  }

  async update(
    req: Request<UpdateAccountRequestParams, {}, UpdateAccountRequestDTO>,
    res: Response<UpdateAccountResponse>
  ) {
    const { accountId } = req.params;
    const { username, email, password, accountLevel } = req.body;

    const updatedAccount = await this.accountService.update(accountId, {
      username,
      email,
      accountLevel,
      password
    });

    res.status(200).json({
      success: true,
      account: {
        _id: updatedAccount._id.toString(),
        email: updatedAccount.email,
        username: updatedAccount.username,
        accountLevel: updatedAccount.accountLevel
      }
    });
  }

  async delete(
    req: Request<DeleteAccountRequestParams>,
    res: Response<DeleteAccountResponse>
  ) {
    const { accountId } = req.params;

    await this.accountService.delete(accountId);

    res.status(200).json({
      success: true
    });
  }
}
