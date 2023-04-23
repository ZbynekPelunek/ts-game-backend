import express, { Request, Response } from 'express';

import { CharacterCurrencyFrontend, Currency, CurrencyId } from '../../../shared/src';
import { generateCharacterCurrencies } from '../defaultCharacterData/currencies';
import { CharacterCurrencyModel } from '../schema/characterCurrency.schema';

export const characterCurrenciesRouter = express.Router();

characterCurrenciesRouter.get('', async (req: Request<{}, {}, {}, { characterId: string, populateCurrencies: boolean }>, res: Response) => {
  const { characterId } = req.query;
  const { populateCurrencies } = req.query;

  let characterCurrencies = [];

  if (populateCurrencies) {
    characterCurrencies = await CharacterCurrencyModel.find({ characterId }).populate<{ currencyId: Currency }>({ path: 'currencyId', select: '-createdAt -updatedAt -__v' });
  } else {
    characterCurrencies = await CharacterCurrencyModel.find({ characterId });
  }

  const responseCharacterCurrencies: CharacterCurrencyFrontend[] = characterCurrencies.map((cc) => {
    return {
      amount: cc.amount,
      characterCurrencyId: cc.id,
      characterId: cc.characterId.toString(),
      currencyId: populateCurrencies ? (cc.currencyId as Currency)._id : cc.currencyId as CurrencyId,
      currency: populateCurrencies ? cc.currencyId as Currency : undefined
    }
  });

  return res.status(200).json({ success: true, characterCurrencies: responseCharacterCurrencies });
})

characterCurrenciesRouter.post('', async (req: Request, res: Response) => {
  const { characterId } = req.body;

  const generatedCharacterCurrencies = generateCharacterCurrencies(characterId);

  const characterCurrencies = await CharacterCurrencyModel.create(generatedCharacterCurrencies);

  const responseArr = characterCurrencies.map(cc => cc._id);

  return res.status(201).json({ success: true, characterCurrencies: responseArr });
});