import { Types } from 'mongoose';
import { CharacterCurrency, CurrencyId } from '../../../shared/src';

export function generateCharacterCurrencies(
  characterId: string
): CharacterCurrency[] {
  return [
    {
      amount: 100,
      currencyId: CurrencyId.CHEATING_CURRENCY,
      characterId: new Types.ObjectId(characterId)
    },
    {
      amount: 10,
      currencyId: CurrencyId.GOLD,
      characterId: new Types.ObjectId(characterId)
    }
  ];
}
