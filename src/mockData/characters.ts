import { Types } from 'mongoose';
import { CharacterBackend } from '../../../shared/src';

export const CHARACTER_ACCOUNT_1_ID = new Types.ObjectId();
export const CHARACTER_ACCOUNT_2_ID = new Types.ObjectId();

export const CHARACTERS_MOCK: CharacterBackend[] = [
  {
    accountId: CHARACTER_ACCOUNT_1_ID,
    name: 'Character1',
  },
  {
    accountId: CHARACTER_ACCOUNT_1_ID,
    name: 'Character2',
  },
  {
    accountId: CHARACTER_ACCOUNT_1_ID,
    name: 'Character3',
  },
  {
    accountId: CHARACTER_ACCOUNT_1_ID,
    name: 'Character4',
  },
  {
    accountId: CHARACTER_ACCOUNT_2_ID,
    name: 'Character5',
  },
  {
    accountId: CHARACTER_ACCOUNT_2_ID,
    name: 'Character6',
  },
  {
    accountId: CHARACTER_ACCOUNT_2_ID,
    name: 'Character7',
  },
  {
    accountId: CHARACTER_ACCOUNT_2_ID,
    name: 'Character8',
  },
];
