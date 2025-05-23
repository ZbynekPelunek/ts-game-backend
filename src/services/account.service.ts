import { compare, hash } from 'bcryptjs';

import {
  CreateAccountRequestDTO,
  CreateAccountResponseDTO,
  UpdateAccountRequestDTO
} from '../../../shared/src';
import { AccountModel } from '../models/account.model';
import { CustomError } from '../middleware/errorHandler.middleware';

export class AccountService {
  async getById(accountId: string) {
    const account = await this.accountIdExists(accountId);

    return account;
  }

  async list() {
    return AccountModel.find({}, {}, { select: '_id' }).lean();
  }

  async create(
    createDto: CreateAccountRequestDTO
  ): Promise<{ createdAccount: CreateAccountResponseDTO }> {
    const { email, password, username } = createDto;

    await this.isEmailUnique(email);

    const hashedPassword = await this.doHash(password, 12);

    const newAcount = new AccountModel({
      email,
      username,
      password: hashedPassword
    });

    const createdAccount = await newAcount.save();

    const accountId = createdAccount.id;

    return {
      createdAccount: {
        _id: accountId,
        email: createdAccount.email,
        username: createdAccount.username
      }
    };
  }

  async update(accountId: string, data: UpdateAccountRequestDTO) {
    await this.accountIdExists(accountId);

    const { username, accountLevel, email, password } = data;

    if (email) {
      await this.isEmailUnique(email);
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await this.doHash(password, 12);
    }

    const updatedAccount = await AccountModel.findByIdAndUpdate(
      accountId,
      {
        username,
        accountLevel,
        email,
        password: hashedPassword
      },
      { lean: true, new: true, select: 'username email accountLevel' }
    );

    if (!updatedAccount) {
      throw new CustomError('Error while updating account.', 400);
    }

    return updatedAccount;
  }

  async delete(accountId: string): Promise<void> {
    await this.accountIdExists(accountId);
    await AccountModel.findByIdAndDelete(accountId);
  }

  async validateCredentials(email: string, password: string) {
    const account = await AccountModel.findOne({ email })
      .select('password email username')
      .lean();

    if (!account) {
      throw new CustomError(`Wrong account credentials.`, 401);
    }

    const isPasswordCorrect = await compare(password, account.password);

    if (!isPasswordCorrect) {
      throw new CustomError(`Wrong account credentials.`, 401);
    }

    return account;
  }

  async accountIdExists(accountId: string, select = '_id') {
    const account = await AccountModel.findById(accountId, undefined, {
      select
    }).lean();

    if (!account) {
      throw new CustomError(`Account with id ${accountId} not found.`, 404);
    }
    return account;
  }

  private async isEmailUnique(email: string): Promise<void> {
    const account = await AccountModel.findOne(
      { email },
      {},
      { select: 'email' }
    ).lean();

    if (account) {
      throw new CustomError('Account with this email already exists.', 400);
    }
  }

  private doHash(value: string, saltValue: number): Promise<string> {
    return hash(value, saltValue);
  }
}
