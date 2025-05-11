import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { CommonErrorResponse } from '../../../shared/src/interface/API/commonResponse';
import { MongooseError } from 'mongoose';

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response<CommonErrorResponse>,
  _next: NextFunction
) => {
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        type: error.type,
        message: error.message,
        details: error.details
      }
    });
  } else if (error instanceof SyntaxError) {
    res.status(400).json({
      success: false,
      error: {
        type: 'Syntax Error',
        message: 'Bad Request.'
      }
    });
  } else if (error instanceof MongooseError) {
    console.error({ name: error.name, message: error.message });
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal database server error.'
      }
    });
  } else {
    console.error(error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error.'
      }
    });
  }
};

export class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public type?: string,
    public details?: string | string[]
  ) {
    super(message);
  }
}
