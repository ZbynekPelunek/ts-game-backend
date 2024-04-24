import { Router } from 'express';

import { ResultController } from '../controllers/result.controller';

export const resultsRouter = Router();
const resultController = new ResultController();

resultsRouter.post('', resultController.post);
