import { Types } from 'mongoose';
import { CharacterBackend } from '../../../shared/src';

export const CHARACTERS_MOCK_ACCOUNT_1_ID = new Types.ObjectId();
export const CHARACTERS_MOCK_ACCOUNT_2_ID = new Types.ObjectId();

export const CHARACTERS_MOCK: CharacterBackend[] = [
  {
    accountId: CHARACTERS_MOCK_ACCOUNT_1_ID,
    name: 'Character1',
  },
  {
    accountId: CHARACTERS_MOCK_ACCOUNT_1_ID,
    name: 'Character2',
  },
  {
    accountId: CHARACTERS_MOCK_ACCOUNT_1_ID,
    name: 'Character3',
  },
  {
    accountId: CHARACTERS_MOCK_ACCOUNT_1_ID,
    name: 'Character4',
  },
  {
    accountId: CHARACTERS_MOCK_ACCOUNT_2_ID,
    name: 'Character5',
  },
  {
    accountId: CHARACTERS_MOCK_ACCOUNT_2_ID,
    name: 'Character6',
  },
  {
    accountId: CHARACTERS_MOCK_ACCOUNT_2_ID,
    name: 'Character7',
  },
  {
    accountId: CHARACTERS_MOCK_ACCOUNT_2_ID,
    name: 'Character8',
  },
];
