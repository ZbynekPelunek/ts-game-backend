import { Router } from 'express';

import { ResultController } from '../controllers/result.controller';

export const resultsRouter = Router();
const resultController = new ResultController();

resultsRouter.post('', resultController.post.bind(resultController));
resultsRouter.get('', resultController.getAll.bind(resultController));
resultsRouter.get(
  '/check-in-progress',
  resultController.checkInProgress.bind(resultController)
);
resultsRouter.get(
  '/:resultId/collect-reward',
  resultController.collectReward.bind(resultController)
);
resultsRouter.get(
  '/:resultId',
  resultController.getOneById.bind(resultController)
);
