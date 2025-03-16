import { Router } from 'express';

import { ResultController } from '../controllers/result.controller';
import { ResultGetActions, ResultPatchActions } from '../../../shared/src';

export const resultsRouter = Router();
const resultController = new ResultController();

resultsRouter.post('', resultController.post.bind(resultController));
resultsRouter.get('', resultController.getAll.bind(resultController));
resultsRouter.get(
  '/:resultId',
  resultController.getOneById.bind(resultController)
);
resultsRouter.patch(
  `/${ResultGetActions.CHECK_IN_PROGRESS}`,
  resultController.checkInProgress.bind(resultController)
);
resultsRouter.patch(
  `/:resultId/${ResultPatchActions.COLLECT_REWARD}`,
  resultController.collectReward.bind(resultController)
);
resultsRouter.patch(
  `/:resultId/${ResultPatchActions.FINISH_RESULT}`,
  resultController.finishResult.bind(resultController)
);
resultsRouter.patch(
  `/:resultId/${ResultPatchActions.CANCEL_ADVENTURE}`,
  resultController.cancelAdventure.bind(resultController)
);
resultsRouter.patch(
  `/:resultId/${ResultPatchActions.SKIP_ADVENTURE}`,
  resultController.skipAdventure.bind(resultController)
);
