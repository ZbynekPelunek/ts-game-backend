import express, { Request, Response } from 'express';

import {
  Request_Adventure_GET_all_query,
  Request_Adventure_GET_one_params,
  Response_Adventure_GET_all,
  Response_Adventure_GET_one,
  Reward,
} from '../../../shared/src';
import { AdventureModel } from '../schema/adventure.schema';

// import { startAdventure } from '../engine/adventure';
export const adventuresRouter = express.Router();

adventuresRouter.get(
  '',
  async (
    req: Request<{}, {}, {}, Request_Adventure_GET_all_query>,
    res: Response<Response_Adventure_GET_all>
  ) => {
    const { populateReward } = req.query;

    const query = AdventureModel.find().lean();

    if (populateReward) {
      query.populate<Reward>({ path: 'rewards.rewardId' });
    }

    const adventures = await query.exec();
    console.log('Adventures All lean response: ', adventures);

    return res.status(200).json({ success: true, adventures });
  }
);

adventuresRouter.get(
  '/:adventureId',
  async (
    req: Request<Request_Adventure_GET_one_params>,
    res: Response<Response_Adventure_GET_one>
  ) => {
    const { adventureId } = req.params;

    const adventure = await AdventureModel.findById(adventureId).lean();

    //console.log('Adventure One lean response: ', adventure);

    if (!adventure) {
      return res.status(404).json({
        success: false,
        error: `Adventure with id '${adventureId}' not found.`,
      });
    }

    return res.status(200).json({ success: true, adventure });
  }
);

// adventuresRouter.post('/:adventureId/actions/:actionId', async (req: Request, res: Response) => {
//   const { adventureId } = req.params;
//   // const characterId = req.body.character.characterId;
//   const actionId = req.params.actionId as AdventureActions;

//   // get character from db with characterId from body
//   const character = testCharacter;

//   // check if adventure exists
//   const adventure = allAdventures[allAdventures.findIndex((a) => a.adventureId === adventureId)];
//   if (!adventure) {
//     throw new NotFoundError(`Adventure with id ${adventureId} not found`);
//   }

//   switch (actionId) {
//     case AdventureActions.START:
//       // complete the adventure and save result
//       const adventureStartResult = await startAdventure(adventure, character);
//       console.log('Adventures in progress after start: ', character.adventures.filter(a => a.adventureState === AdventureState.IN_PROGRESS));

//       // return result ID for future retrieval
//       return res.status(201).json({ message: `Adventure ${adventure.name} started`, result: adventureStartResult });
//     default:
//       throw new NotFoundError(`Action ${actionId} not supported`);
//   }
// })
