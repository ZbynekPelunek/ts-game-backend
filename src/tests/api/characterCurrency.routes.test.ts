import request from 'supertest';
import { describe, afterEach, it, expect } from '@jest/globals';

import {
  CharacterCurrency_GET_all,
  CharacterCurrencyBackend,
  Currency,
  CurrencyId,
  CharacterCurrency_POST,
  CharacterCurrencyFrontend,
  Request_CharacterCurrency_POST_body,
  Request_CharacterCurrency_PATCH_body,
  CharacterCurrency_PATCH
} from '../../../../shared/src';
import { APP_SERVER, UNKNOWN_OBJECT_ID } from '../setupFile';
import { CharacterCurrencyModel } from '../../models/characterCurrency.model';
import { CurrencyModel } from '../../models/currency.model';
import { PUBLIC_ROUTES } from '../../services/apiService';

describe('Character Currency routes', () => {
  const apiAddress = PUBLIC_ROUTES.CharacterCurrencies;

  afterEach(async () => {
    await CharacterCurrencyModel.deleteMany();
    await CurrencyModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all available character currencies', async () => {
      const currencyId = CurrencyId.GOLD;

      await addCharCurrencyToDb(currencyId);

      const currenciessLength = await CharacterCurrencyModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const characterCurrenciesResponse: CharacterCurrency_GET_all = res.body;
      expect(characterCurrenciesResponse.success).toBe(true);
      expect(characterCurrenciesResponse.characterCurrencies).toHaveLength(
        currenciessLength
      );
    });

    it('returns status code 200 with all available character currencies for specific character', async () => {
      const currencyId = CurrencyId.GOLD;
      const characterId = UNKNOWN_OBJECT_ID;

      await addCharCurrencyToDb(currencyId, 15, characterId);

      const currenciessLength = await CharacterCurrencyModel.countDocuments();

      const res = await request(APP_SERVER).get(
        `${apiAddress}?characterId=${characterId}`
      );

      expect(res.statusCode).toEqual(200);
      const characterCurrenciesResponse: CharacterCurrency_GET_all = res.body;
      expect(characterCurrenciesResponse.success).toBe(true);
      expect(characterCurrenciesResponse.characterCurrencies).toHaveLength(
        currenciessLength
      );
    });

    it('returns status code 200 with all available character currencies for specific character and populates Currency details', async () => {
      const characterId = UNKNOWN_OBJECT_ID;
      const currencyId = CurrencyId.GOLD;
      const currencyName = 'GOLD';
      const currencyLabel = 'Gold';
      const currency = new CurrencyModel<Currency>({
        _id: currencyId,
        label: currencyLabel,
        name: currencyName
      });

      await currency.save();

      await addCharCurrencyToDb(currencyId, 15, characterId);

      const charAttributesLength =
        await CharacterCurrencyModel.countDocuments();

      const res = await request(APP_SERVER).get(
        `${apiAddress}?characterId=${characterId}&populateCurrency=true`
      );

      expect(res.statusCode).toEqual(200);
      const characterCurrenciesResponse: CharacterCurrency_GET_all = res.body;
      expect(characterCurrenciesResponse.success).toBe(true);
      expect(characterCurrenciesResponse.characterCurrencies).toHaveLength(
        charAttributesLength
      );
      const populatedCurrency = characterCurrenciesResponse
        .characterCurrencies[0].currencyId as Currency;
      expect(populatedCurrency._id).toBe(currencyId);
      expect(populatedCurrency.label).toBe(currencyLabel);
      expect(populatedCurrency.name).toBe(currencyName);
    });
  });

  describe(`POST ${apiAddress}`, () => {
    it('returns status code 201 with multiple created character currencies', async () => {
      const charCurrBody: Request_CharacterCurrency_POST_body = {
        characterCurrencies: [
          {
            characterId: UNKNOWN_OBJECT_ID.toString(),
            currencyId: CurrencyId.CHEATING_CURRENCY,
            amount: 0
          },
          {
            characterId: UNKNOWN_OBJECT_ID.toString(),
            currencyId: CurrencyId.GOLD,
            amount: 10
          }
        ]
      };
      const charCurrLength = (
        charCurrBody.characterCurrencies as Omit<
          CharacterCurrencyFrontend,
          '_id'
        >[]
      ).length;

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send(charCurrBody);

      expect(res.statusCode).toEqual(201);
      const characterCurrenciesResponse: CharacterCurrency_POST = res.body;
      expect(characterCurrenciesResponse.success).toBe(true);
      expect(characterCurrenciesResponse.characterCurrencies).toHaveLength(
        charCurrLength
      );
    });

    it('returns status code 201 with single created character currency', async () => {
      const charCurrBody: Request_CharacterCurrency_POST_body = {
        characterCurrencies: {
          characterId: UNKNOWN_OBJECT_ID.toString(),
          currencyId: CurrencyId.CHEATING_CURRENCY,
          amount: 0
        }
      };

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send(charCurrBody);

      expect(res.statusCode).toEqual(201);
      const characterCurrenciesResponse: CharacterCurrency_POST = res.body;
      expect(characterCurrenciesResponse.success).toBe(true);
      expect(characterCurrenciesResponse.characterCurrencies).toHaveLength(1);
    });
  });

  describe(`PATCH ${apiAddress}/<CHARACTER_CURRENCY_ID>`, () => {
    it('returns status code 200 with updated character currency', async () => {
      const startingAmount = 1;
      const amountToIncrease = 5;
      const characterCurrency = await addCharCurrencyToDb(
        CurrencyId.GOLD,
        startingAmount
      );
      const characterCurrencyId = characterCurrency.id;

      const requestBody: Request_CharacterCurrency_PATCH_body = {
        amount: amountToIncrease
      };
      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${characterCurrencyId}`)
        .send(requestBody);

      expect(res.statusCode).toEqual(200);
      const characterCurrenciesResponse: CharacterCurrency_PATCH = res.body;
      expect(characterCurrenciesResponse.success).toBe(true);
      expect(characterCurrenciesResponse.characterCurrency.amount).toBe(
        startingAmount + amountToIncrease
      );
      expect(characterCurrenciesResponse.characterCurrency.currencyId).toBe(
        CurrencyId.GOLD
      );
    });
  });
});

async function addCharCurrencyToDb(
  currencyId: CurrencyId,
  amount = 0,
  characterId = UNKNOWN_OBJECT_ID
) {
  const currency = new CharacterCurrencyModel<CharacterCurrencyBackend>({
    amount,
    characterId,
    currencyId
  });

  return currency.save();
}
