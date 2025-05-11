import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { CustomError } from './errorHandler.middleware';

export const validateRequest = (
  schema: Schema,
  property: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false
    });
    if (error) {
      throw new CustomError(
        'Data did not pass validation check.',
        400,
        error.name,
        error.details.map((err) => err.message)
      );
    } else {
      next();
    }
  };
};
