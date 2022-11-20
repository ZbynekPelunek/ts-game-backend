import express, { Response } from 'express';

import { Attempt, Mount } from '../../../shared/src';

export const fortuneRouter = express.Router();

fortuneRouter.get('/mounts', (_req, res): Response<Mount[]> => {
  const mounts = [
    {
      name: "Kor'kron Juggernaut"
    },
    {
      name: 'Invincible'
    },
    {
      name: "Mimiron's Head"
    },
    {
      name: 'Antoran Charhound'
    },
    {
      name: "Ashes of Al'ar"
    }
  ];

  return res.status(200).json(mounts);
})

fortuneRouter.post('/predict', (req, res): Response<Attempt> => {
  let attempts = countAttempts(req.body.tries);

  return res.status(200).json({ attempts });
})

function countAttempts(tries: number): number {
  let attempts = tries;

  const drop = Math.floor(Math.random() * 100 + 1);

  attempts++;
  if (drop !== 1) {
    return countAttempts(attempts);
  }
  return attempts;
}