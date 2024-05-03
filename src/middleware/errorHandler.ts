import { Request, Response } from 'express';

export const errorHandler = (
  error: any,
  _req: Request<object, object, object, object>,
  res: Response
) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  } else if (error instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      error: 'Bad request: Malformed JSON',
    });
  } else if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((val: any) => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', '),
    });
  } else if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid token',
    });
  } else {
    console.error('Unhandled error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
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
