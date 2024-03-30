import express, { Request, Response } from 'express';

import { CharacterCurrencyFrontend, Currency, Request_CharacterCurrency_GET_all_query, Request_CharacterCurrency_POST_body, Response_CharacterCurrency_GET_all, Response_CharacterCurrency_POST } from '../../../shared/src';
import { CharacterCurrencyModel, CharacterCurrencySchema } from '../schema/characterCurrency.schema';
import { Document } from 'mongoose';

export const characterCurrenciesRouter = express.Router();

characterCurrenciesRouter.get('', async (req: Request<{}, {}, {}, Request_CharacterCurrency_GET_all_query>, res: Response<Response_CharacterCurrency_GET_all>) => {
  const { characterId } = req.query;
  const { populateCurrency } = req.query;

  let characterCurrencies = [];
  if (!characterId) {
    characterCurrencies = await CharacterCurrencyModel.find();
    const responseCharacterCurrencies = characterCurrencies.map(cc => {
      return transformResponse(cc);
    });

    return res.status(200).json({ success: true, characterCurrencies: responseCharacterCurrencies });
  }

  let responseCharacterCurrencies: CharacterCurrencyFrontend[] = [];
  if (populateCurrency) {
    const populatedCharacterCurrencies = await CharacterCurrencyModel.find({ characterId: characterId }).populate<{ currencyId: Currency }>({ path: 'currencyId', select: '-createdAt -updatedAt -__v' });

    responseCharacterCurrencies = populatedCharacterCurrencies.map(cc => {
      return {
        amount: cc.amount,
        characterCurrencyId: cc.id,
        characterId: cc.characterId.toString(),
        currencyId: cc.currencyId._id,
        currency: cc.currencyId
      }
    });
  } else {
    const characterCurrencies = await CharacterCurrencyModel.find({ characterId: characterId });

    responseCharacterCurrencies = characterCurrencies.map(cc => {
      return transformResponse(cc);
    });
  }

  return res.status(200).json({ success: true, characterCurrencies: responseCharacterCurrencies });
});

characterCurrenciesRouter.post('', async (req: Request<{}, {}, Request_CharacterCurrency_POST_body>, res: Response<Response_CharacterCurrency_POST>) => {
  try {
    const { characterCurrencies } = req.body;

    const characterCurrenciesDbRes = await CharacterCurrencyModel.create(characterCurrencies);

    let responseArr: CharacterCurrencyFrontend[] = [];
    if (Array.isArray(characterCurrenciesDbRes)) {
      responseArr = characterCurrenciesDbRes.map(cc => {
        return transformResponse(cc);
      });
    } else {
      const charAttributeResponse: CharacterCurrencyFrontend = transformResponse(characterCurrenciesDbRes);
      responseArr.push(charAttributeResponse);
    }

    return res.status(201).json({ success: true, characterCurrencies: responseArr });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

const transformResponse = (databaseResponse: CharacterCurrencySchema & Document): CharacterCurrencyFrontend => {
  return {
    amount: databaseResponse.amount,
    characterCurrencyId: databaseResponse.id,
    characterId: databaseResponse.characterId.toString(),
    currencyId: databaseResponse.currencyId
  }
}