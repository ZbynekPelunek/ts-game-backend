import { Router } from 'express';

import { AccountController } from '../../controllers/account.controller';

export const accountsInternalRouter = Router();
const accountController = new AccountController();

accountsInternalRouter.get('', accountController.list.bind(accountController));
