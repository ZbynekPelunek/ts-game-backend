import request from 'supertest';
import { describe, afterEach, it, expect } from '@jest/globals';

import {
  CharacterCurrency_GET_all,
  CharacterCurrencyBackend,
  Currency,
  CurrencyId,
  CharacterCurrency_POST,
  CharacterCurrencyFrontend,
} from '../../../shared/src';
import { APP_SERVER, unknownID } from '../tests/setupFile';
import { CharacterCurrencyModel } from '../schema/characterCurrency.schema';
import { CurrencyModel } from '../schema/currency.schema';
import { PUBLIC_ROUTES } from '../server';

describe('Character Currency routes', () => {
  const apiAddress = PUBLIC_ROUTES.CharacterCurrencies;

  afterEach(async () => {
    await CharacterCurrencyModel.deleteMany();
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
      const characterId = unknownID;

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
      const characterId = unknownID;
      const currencyId = CurrencyId.GOLD;
      const currencyName = 'GOLD';
      const currencyLabel = 'Gold';
      const currency = new CurrencyModel<Currency>({
        _id: currencyId,
        label: currencyLabel,
        name: currencyName,
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
      expect(
        characterCurrenciesResponse.characterCurrencies[0].currency?._id
      ).toBe(currencyId);
      expect(
        characterCurrenciesResponse.characterCurrencies[0].currency?.label
      ).toBe(currencyLabel);
      expect(
        characterCurrenciesResponse.characterCurrencies[0].currency?.name
      ).toBe(currencyName);
      await CurrencyModel.deleteMany();
    });
  });

  describe(`POST ${apiAddress}`, () => {
    it('returns status code 201 with multiple created character currencies', async () => {
      const characterCurrencies: CharacterCurrencyFrontend[] = [
        {
          characterId: unknownID.toString(),
          currencyId: CurrencyId.CHEATING_CURRENCY,
          amount: 0,
          characterCurrencyId: '',
        },
        {
          characterId: unknownID.toString(),
          currencyId: CurrencyId.GOLD,
          amount: 10,
          characterCurrencyId: '',
        },
      ];

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send({ characterCurrencies });

      expect(res.statusCode).toEqual(201);
      const characterCurrenciesResponse: CharacterCurrency_POST = res.body;
      expect(characterCurrenciesResponse.success).toBe(true);
      expect(characterCurrenciesResponse.characterCurrencies).toHaveLength(
        characterCurrencies.length
      );
    });

    it('returns status code 201 with single created character currency', async () => {
      const characterCurrency: CharacterCurrencyFrontend = {
        characterId: unknownID.toString(),
        currencyId: CurrencyId.CHEATING_CURRENCY,
        amount: 0,
        characterCurrencyId: '',
      };

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send({ characterCurrencies: characterCurrency });

      expect(res.statusCode).toEqual(201);
      const characterCurrenciesResponse: CharacterCurrency_POST = res.body;
      expect(characterCurrenciesResponse.success).toBe(true);
      expect(characterCurrenciesResponse.characterCurrencies).toHaveLength(1);
    });
  });
});

async function addCharCurrencyToDb(
  currencyId: CurrencyId,
  amount = 0,
  characterId = unknownID
) {
  const currency = new CharacterCurrencyModel<CharacterCurrencyBackend>({
    amount,
    characterId,
    currencyId,
  });

  return await currency.save();
}
