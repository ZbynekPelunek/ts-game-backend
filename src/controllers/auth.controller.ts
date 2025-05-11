import { Request, Response } from 'express-serve-static-core';

import { AuthService } from '../services/auth.service';
import {
  AuthLoginRequestDTO,
  AuthLoginResponse,
  AuthStatusResponse
} from '../../../shared/src';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async status(req: Request, res: Response<AuthStatusResponse>) {
    const { token } = req.cookies;
    if (!token) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true
      });
      res.status(200).json({ success: true, authenticated: false });
      return;
    }
    const authenticated = await this.authService.status({
      token
    });

    if (authenticated === false) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true
      });
    }

    res.status(200).json({ success: true, authenticated });
  }

  async login(
    req: Request<{}, {}, AuthLoginRequestDTO>,
    res: Response<AuthLoginResponse>
  ) {
    const { email, password } = req.body;

    const { token, loggedInAccount } = await this.authService.login({
      email,
      password
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      partitioned: true
    });

    res.status(200).json({
      success: true,
      account: {
        _id: loggedInAccount._id,
        email: loggedInAccount.email,
        username: loggedInAccount.username
      }
    });
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true
    });

    res.status(200).json({ success: true });
  }
}
