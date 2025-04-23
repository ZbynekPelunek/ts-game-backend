import Joi from 'joi';
import {
  CreateAccountRequestDTO,
  DeleteAccountRequestParams,
  GetAccountRequestParams,
  LoginAccountRequestDTO,
  UpdateAccountRequestDTO,
  UpdateAccountRequestParams
} from '../../../shared/src';
import {
  EMAIL_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH
} from '../models/accountModel';
import { validObjectIdCheck } from '../utils/joiCustomMethods';

export const getAccountParamsSchema = Joi.object<GetAccountRequestParams>({
  accountId: Joi.string().required().custom(validObjectIdCheck)
});

export const createAccountBodySchema = Joi.object<CreateAccountRequestDTO>({
  username: Joi.string()
    .min(USERNAME_MIN_LENGTH)
    .max(USERNAME_MAX_LENGTH)
    .alphanum()
    .required(),
  email: Joi.string().email().min(EMAIL_MIN_LENGTH).required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required()
}).required();

export const loginAccountBodySchema = Joi.object<LoginAccountRequestDTO>({
  email: Joi.string().email().min(EMAIL_MIN_LENGTH).required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required()
}).required();

export const updateAccountParamsSchema = Joi.object<UpdateAccountRequestParams>(
  {
    accountId: Joi.string().required().custom(validObjectIdCheck)
  }
);

export const updateAccountBodySchema = Joi.object<UpdateAccountRequestDTO>({
  username: Joi.string()
    .min(USERNAME_MIN_LENGTH)
    .max(USERNAME_MAX_LENGTH)
    .alphanum(),
  email: Joi.string().email().min(EMAIL_MIN_LENGTH),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
  accountLevel: Joi.number()
}).required();

export const deleteAccountParamsSchema = Joi.object<DeleteAccountRequestParams>(
  {
    accountId: Joi.string().required().custom(validObjectIdCheck)
  }
);
