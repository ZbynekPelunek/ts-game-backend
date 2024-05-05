import { Types } from 'mongoose';
import { ResultBackend } from '../../../shared/src';

export const RESULTS_MOCK_CHARACTERID = new Types.ObjectId();

const nowISO = new Date(Date.now()).toISOString();
const nowInOneHourISO = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString();

export const RESULTS_MOCK: ResultBackend[] = [
  {
    adventureId: 1,
    characterId: RESULTS_MOCK_CHARACTERID,
    combat: {
      log: 'abc',
      playerWon: true,
    },
    timeFinish: nowInOneHourISO,
    timeStart: nowISO,
  },
  {
    adventureId: 1,
    characterId: RESULTS_MOCK_CHARACTERID,
    combat: {
      log: 'abc',
      playerWon: false,
    },
    timeFinish: nowInOneHourISO,
    timeStart: nowISO,
  },
  {
    adventureId: 2,
    characterId: RESULTS_MOCK_CHARACTERID,
    combat: {
      log: 'abc',
      playerWon: true,
    },
    timeFinish: nowInOneHourISO,
    timeStart: nowISO,
  },
];
