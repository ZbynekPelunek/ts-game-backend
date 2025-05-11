import Joi from 'joi';

import {
  EMAIL_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from '../models/account.model';
import { AuthLoginRequestDTO } from '../../../shared/src';

export const authLoginBodySchema = Joi.object<AuthLoginRequestDTO>({
  email: Joi.string().email().min(EMAIL_MIN_LENGTH).required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required()
}).required();
