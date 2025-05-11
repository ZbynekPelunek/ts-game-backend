import { Router } from 'express';

import { AuthController } from '../../controllers/auth.controller';
import { authLoginBodySchema } from '../../joiSchemas/auth.schema';
import { validateRequest } from '../../middleware/validate.middleware';

export const authV1Router = Router();
const authController = new AuthController();

authV1Router.get('/status', authController.status.bind(authController));

authV1Router.post(
  '/login',
  validateRequest(authLoginBodySchema, 'body'),
  authController.login.bind(authController)
);
authV1Router.post('/logout', authController.logout.bind(authController));
