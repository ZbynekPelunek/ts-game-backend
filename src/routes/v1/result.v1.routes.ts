import { Router } from 'express';

import { ResultController } from '../../controllers/result.controller';
import { ResultGetActions, ResultPatchActions } from '../../../../shared/src';
import { authenticateJWT } from '../../middleware/auth.middleware';
import {
  getResultParamSchema,
  listResultsQuerySchema
} from '../../joiSchemas/result.schema';
import { validateRequest } from '../../middleware/validate.middleware';

export const resultsV1Router = Router();
const resultController = new ResultController();

resultsV1Router.get(
  '',
  authenticateJWT,
  validateRequest(listResultsQuerySchema, 'query'),
  resultController.list.bind(resultController)
);
resultsV1Router.get(
  '/:resultId',
  authenticateJWT,
  validateRequest(getResultParamSchema, 'params'),
  resultController.getOneById.bind(resultController)
);

resultsV1Router.post(
  '',
  authenticateJWT,
  resultController.create.bind(resultController)
);

resultsV1Router.patch(
  `/${ResultGetActions.CHECK_IN_PROGRESS}`,
  authenticateJWT,
  resultController.checkInProgress.bind(resultController)
);
resultsV1Router.patch(
  `/:resultId/${ResultPatchActions.COLLECT_REWARD}`,
  authenticateJWT,
  resultController.collectReward.bind(resultController)
);
resultsV1Router.patch(
  `/:resultId/${ResultPatchActions.FINISH_RESULT}`,
  authenticateJWT,
  resultController.finishResult.bind(resultController)
);
resultsV1Router.patch(
  `/:resultId/${ResultPatchActions.CANCEL_ADVENTURE}`,
  authenticateJWT,
  resultController.cancelAdventure.bind(resultController)
);
resultsV1Router.patch(
  `/:resultId/${ResultPatchActions.SKIP_ADVENTURE}`,
  authenticateJWT,
  resultController.skipAdventure.bind(resultController)
);
