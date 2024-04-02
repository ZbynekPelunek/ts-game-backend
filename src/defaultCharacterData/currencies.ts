import { CharacterCurrencyFrontend, CurrencyId } from '../../../shared/src';

export function generateCharacterCurrencies(
  characterId: string
): CharacterCurrencyFrontend[] {
  return [
    {
      amount: 100,
      currencyId: CurrencyId.CHEATING_CURRENCY,
      characterId,
      characterCurrencyId: '',
    },
    {
      amount: 10,
      currencyId: CurrencyId.GOLD,
      characterId,
      characterCurrencyId: '',
    },
  ];
}
