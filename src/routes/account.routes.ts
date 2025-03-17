import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';

export const accountsRouter = Router();
const accountController = new AccountController();

accountsRouter.post('', accountController.create);
