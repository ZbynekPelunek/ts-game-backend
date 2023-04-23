import { Types } from 'mongoose';

import { CharacterCurrencyBackend, CurrencyId } from '../../../shared/src';

export function generateCharacterCurrencies(characterId: Types.ObjectId): CharacterCurrencyBackend[] {
  return [
    {
      amount: 100,
      currencyId: CurrencyId.CHEATING_CURRENCY,
      characterId
    },
    {
      amount: 10,
      currencyId: CurrencyId.GOLD,
      characterId
    }
  ]
}