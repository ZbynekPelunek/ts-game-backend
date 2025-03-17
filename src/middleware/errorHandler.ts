import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export const errorHandler: ErrorRequestHandler = (
  error: any,
  _req: Request<any, any, any, any>,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
  } else if (error instanceof SyntaxError) {
    res.status(400).json({
      success: false,
      error: 'Bad request: Malformed JSON'
    });
  } else if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((val: any) => val.message);
    res.status(400).json({
      success: false,
      error: messages.join(', ')
    });
  } else if (error.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid token'
    });
  } else {
    console.error('Unhandled error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
  }
}
