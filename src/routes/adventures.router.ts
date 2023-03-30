import express, { Request, Response } from 'express';

import { AdventureActions, AdventureState, Error, IAdventure } from '../../../shared/src';
import { NotFoundError } from '../errors/not-found-error';
import { allAdventures } from '../test/testAdventures';
import { testCharacter } from '../test/testCharacter';

// import { startAdventure } from '../engine/adventure';
export const adventuresRouter = express.Router();

adventuresRouter.get('', (_req, res: Response): Response<IAdventure[]> => {
  return res.status(200).json(allAdventures);
})

adventuresRouter.get('/:id', (req: Request, res: Response): Response<IAdventure | Error> => {
  const adventureId: string = req.params.id;

  const adventure = allAdventures[allAdventures.findIndex((a) => a.adventureId === adventureId)];
  if (!adventure) {
    throw new NotFoundError(`Adventure with id ${adventureId} not found`);
  }

  return res.status(200).json({ adventure });
})

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