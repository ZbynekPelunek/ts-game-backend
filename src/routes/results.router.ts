import express, { Request, Response } from 'express';

export const resultsRouter = express.Router();

export const adventureResults = [];

// resultsRouter.get('/:resultId', (req: Request, res: Response) => {
//   const { resultId } = req.params;

//   const result = adventureResults[adventureResults.findIndex((r) => r.resultId === resultId)];
//   if (!result) {
//     throw new NotFoundError(`Result with id ${resultId} not found`);
//   }

//   if (!adventureResults.find((a) => a.adventureId === result.adventureId)) {
//     throw new NotFoundError(`Adventure with id ${result.adventureId} in results not found`);
//   }

//   // get character from db with characterId from result
//   const character = testCharacter;
//   const adventure = character.adventures.find(a => a.adventureId === result.adventureId);
//   if (!adventure) {
//     return res.status(404).json({
//       error: 'Not Found',
//       message: `Adventure with id ${result.adventureId} not found in In Progress adventures`
//     })
//   }

//   if (result.playerWon) {
//     character.addExperience(adventure.reward.experience);
//     if (adventure.reward.items) {
//       adventure.reward.items.forEach((r) => {
//         character.addItemToInventory(r);
//       })
//     }
//   }

//   adventure.adventureState = AdventureState.IDLE; // should be AdventureState.COMPLETE

//   return res.status(200).json({ result });
// })