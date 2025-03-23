import { NextFunction, Request, Response } from 'express-serve-static-core';

import {
  CreateAccountRequestDTO,
  CreateAccountResponseDTO,
  DeleteAccountRequestParams,
  DeleteAccountResponseDTO,
  GetAccountRequestParams,
  GetAccountResponseDTO,
  ListAccountsResponseDTO,
  UpdateAccountRequestDTO,
  UpdateAccountRequestParams,
  UpdateAccountResponseDTO
} from '../../../shared/src';
import { CreateAccountCommand } from '../commands/account/create';
import { errorHandler } from '../middleware/errorHandler';
import { ListAccountsQuery } from '../queries/account/list';
import { GetAccountQuery } from '../queries/account/get';
import { UpdateAccountCommand } from '../commands/account/update';
import { DeleteAccountCommand } from '../commands/account/delete';

export class AccountController {
  private createAccountCommand: CreateAccountCommand;
  private listAccountsQuery: ListAccountsQuery;
  private getAccountQuery: GetAccountQuery;
  private updateAccountCommand: UpdateAccountCommand;
  private deleteAccountCommand: DeleteAccountCommand;

  constructor() {
    this.createAccountCommand = new CreateAccountCommand();
    this.listAccountsQuery = new ListAccountsQuery();
    this.getAccountQuery = new GetAccountQuery();
    this.updateAccountCommand = new UpdateAccountCommand();
    this.deleteAccountCommand = new DeleteAccountCommand();
  }

  async list(
    req: Request,
    res: Response<ListAccountsResponseDTO>,
    _next: NextFunction
  ) {
    try {
      const response = await this.listAccountsQuery.execute();

      res.status(200).json(response);
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async get(
    req: Request<GetAccountRequestParams>,
    res: Response<GetAccountResponseDTO>,
    _next: NextFunction
  ) {
    const { params } = req;
    try {
      const response = await this.getAccountQuery.execute(params);

      res.status(200).json(response);
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async create(
    req: Request<{}, {}, CreateAccountRequestDTO>,
    res: Response<CreateAccountResponseDTO>,
    _next: NextFunction
  ) {
    const { body } = req;
    try {
      const response = await this.createAccountCommand.execute(body);

      res.status(201).json(response);
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async update(
    req: Request<UpdateAccountRequestParams, {}, UpdateAccountRequestDTO>,
    res: Response<UpdateAccountResponseDTO>,
    _next: NextFunction
  ) {
    const { params } = req;
    const { body } = req;
    try {
      const response = await this.updateAccountCommand.execute(params, body);

      res.status(200).json(response);
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async delete(
    req: Request<DeleteAccountRequestParams>,
    res: Response<DeleteAccountResponseDTO>,
    _next: NextFunction
  ) {
    const { params } = req;
    try {
      const response = await this.deleteAccountCommand.execute(params);

      res.status(200).json(response);
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }
}
