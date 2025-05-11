import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomError } from './errorHandler.middleware';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment');
}

export interface TokenValues {
  accountId: string;
  characterIds: string[];
}

export interface AuthTokenPayload extends TokenValues, JwtPayload {}

export type AuthenticatedResponse<T = unknown> = Response<
  T,
  { payload: AuthTokenPayload }
>;

export function authenticateJWT(
  req: Request,
  res: AuthenticatedResponse,
  next: NextFunction
) {
  const { token } = req.cookies;
  if (!token) {
    throw new CustomError('No token provided.', 401);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    console.log('JWT middleware payload: ', payload);
    res.locals = {
      ...res.locals,
      payload
    };

    next();
  } catch (err) {
    throw new CustomError('Invalid or expired token.', 401);
  }
}
