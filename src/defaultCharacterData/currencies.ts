import { CharacterCurrencyFrontend, CurrencyId } from '../../../shared/src';

export function generateCharacterCurrencies(
  characterId: string
): Omit<CharacterCurrencyFrontend, '_id'>[] {
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
  ];
}
