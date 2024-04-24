import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ error: 'Not authorized' }];
  }
}
