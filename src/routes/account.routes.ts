import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { validateRequest } from '../middleware/validate';
import {
  createAccountBodySchema,
  getAccountParamsSchema,
  updateAccountParamsSchema,
  updateAccountBodySchema,
  deleteAccountParamsSchema,
  loginAccountBodySchema
} from '../joiSchemas/account.schema';

export const accountsRouter = Router();
const accountController = new AccountController();

accountsRouter.get('', accountController.list.bind(accountController));
accountsRouter.get(
  '/:accountId',
  validateRequest(getAccountParamsSchema, 'params'),
  accountController.get.bind(accountController)
);

accountsRouter.post(
  '',
  validateRequest(createAccountBodySchema, 'body'),
  accountController.create.bind(accountController)
);
accountsRouter.post(
  '/login',
  validateRequest(loginAccountBodySchema, 'body'),
  accountController.login.bind(accountController)
);
accountsRouter.post(
  '/logout',
  accountController.logout.bind(accountController)
);

accountsRouter.patch(
  '/:accountId',
  validateRequest(updateAccountParamsSchema, 'params'),
  validateRequest(updateAccountBodySchema, 'body'),
  accountController.update.bind(accountController)
);

accountsRouter.delete(
  '/:accountId',
  validateRequest(deleteAccountParamsSchema, 'params'),
  accountController.delete.bind(accountController)
);
