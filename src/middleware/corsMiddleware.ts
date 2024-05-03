import { Request, Response, NextFunction } from 'express';

export function corsMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.FRONTEND_URL || 'http://localhost:4200'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, PUT, DELETE, POST');
  next();
}
