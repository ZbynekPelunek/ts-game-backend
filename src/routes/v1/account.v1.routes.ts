import { Router } from 'express';

import { AccountController } from '../../controllers/account.controller';
import {
  getAccountParamsSchema,
  createAccountBodySchema,
  updateAccountParamsSchema,
  updateAccountBodySchema,
  deleteAccountParamsSchema
} from '../../joiSchemas/account.schema';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';

export const accountsV1Router = Router();
const accountController = new AccountController();

accountsV1Router.get(
  '/:accountId',
  authenticateJWT,
  validateRequest(getAccountParamsSchema, 'params'),
  accountController.get.bind(accountController)
);

accountsV1Router.post(
  '',
  validateRequest(createAccountBodySchema, 'body'),
  accountController.create.bind(accountController)
);

accountsV1Router.patch(
  '/:accountId',
  authenticateJWT,
  validateRequest(updateAccountParamsSchema, 'params'),
  validateRequest(updateAccountBodySchema, 'body'),
  accountController.update.bind(accountController)
);

accountsV1Router.delete(
  '/:accountId',
  authenticateJWT,
  validateRequest(deleteAccountParamsSchema, 'params'),
  accountController.delete.bind(accountController)
);
