import { hash } from 'bcryptjs';
import {
  CreateAccountRequestDTO,
  UpdateAccountRequestDTO
} from '../../../shared/src';
import { AccountModel } from '../models/accountModel';
import { CustomError } from '../middleware/errorHandler';

export class AccountService {
  async getById(accountId: string) {
    const account = await AccountModel.findById(accountId, undefined, {
      select: '_id'
    }).lean();

    if (!account) {
      throw new CustomError(`Account with id ${accountId} not found.`, 404);
    }

    return account;
  }

  async list() {
    return AccountModel.find({}, {}, { select: '_id' }).lean();
  }

  async create(createDto: CreateAccountRequestDTO) {
    const { email, password, username } = createDto;

    const isEmailUnique = await this.isEmailUnique(email);

    if (!isEmailUnique) {
      throw new CustomError('Account with this email already exists.', 400);
    }

    const hashedPassword = await this.doHash(password, 12);

    const newAcount = new AccountModel({
      email,
      username,
      password: hashedPassword
    });

    return newAcount.save();
  }

  async update(accountId: string, data: UpdateAccountRequestDTO) {
    const { username, accountLevel, email, password } = data;

    if (email) {
      const isEmailUnique = await this.isEmailUnique(email);

      if (!isEmailUnique) {
        throw new CustomError('Account with this email already exists.', 400);
      }
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
    await AccountModel.findByIdAndDelete(accountId);
  }

  private async isEmailUnique(email: string): Promise<boolean> {
    return (await AccountModel.findOne(
      { email },
      {},
      { select: 'email' }
    ).lean())
      ? false
      : true;
  }

  private doHash(value: string, saltValue: number): Promise<string> {
    return hash(value, saltValue);
  }
}
