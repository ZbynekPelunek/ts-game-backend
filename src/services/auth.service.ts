import 'dotenv/config';
import { sign, verify } from 'jsonwebtoken';

import { AuthLoginRequestDTO, AuthLoginResponseDTO } from '../../../shared/src';
import { AccountService } from './account.service';
import { AuthTokenPayload, TokenValues } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthService {
  private accountService = new AccountService();

  async login(
    loginDto: AuthLoginRequestDTO
  ): Promise<{ token: string; loggedInAccount: AuthLoginResponseDTO }> {
    const { email, password } = loginDto;

    const account = await this.accountService.validateCredentials(
      email,
      password
    );

    const accountId = account._id.toString();
    const token = sign(
      { accountId, characterIds: [] } as TokenValues,
      JWT_SECRET
    );

    return {
      token,
      loggedInAccount: {
        _id: accountId,
        email: account.email,
        username: account.username
      }
    };
  }

  async status(cookies: { token: string }): Promise<boolean> {
    const { token } = cookies;

    try {
      const payload = verify(token, JWT_SECRET) as AuthTokenPayload;

      const account = await this.accountService.accountIdExists(
        payload.accountId
      );

      if (!account) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Auth Status error: ', error);
      return false;
    }
  }
}
