import { Request, Response } from 'express-serve-static-core';

import {
  ListCharacterCurrenciesQuery,
  ListCharacterCurrenciesResponse,
  CreateCharacterCurrencyRequestDTO,
  CreateCharacterCurrencyResponse,
  UpdateCharacterCurrencyRequestDTO,
  UpdateCharacterCurrencyRequestParams,
  UpdateCharacterCurrencyResponse,
  CharacterCurrencyDTO
} from '../../../shared/src';
import { CharacterCurrencyService } from '../services/characterCurrency.service';

export class CharacterCurrencyController {
  private characterCurrencyService: CharacterCurrencyService;

  constructor() {
    this.characterCurrencyService = new CharacterCurrencyService();
  }

  async list(
    req: Request<{}, {}, {}, ListCharacterCurrenciesQuery>,
    res: Response<ListCharacterCurrenciesResponse>
  ) {
    const { characterId, populateCurrency, currencyId } = req.query;

    const characterCurrencies = await this.characterCurrencyService.list({
      characterId,
      populateCurrency,
      currencyId
    });

    res.status(200).json({
      success: true,
      characterCurrencies: characterCurrencies.map((charCurr) => {
        const characterCurrency: CharacterCurrencyDTO = {
          _id: charCurr._id,
          amount: charCurr.amount,
          currencyId: charCurr.currencyId
        };

        if (!populateCurrency) {
          return characterCurrency;
        }

        return {
          ...characterCurrency,
          currency: {
            _id: charCurr.currency?._id!,
            label: charCurr.currency?.label!,
            cap: charCurr.currency?.cap,
            desc: charCurr.currency?.desc
          }
        };
      })
    });
  }

  async create(
    req: Request<{}, {}, CreateCharacterCurrencyRequestDTO>,
    res: Response<CreateCharacterCurrencyResponse>
  ) {
    const { amount, characterId, currencyId } = req.body;

    const newCharacterCurrency = await this.characterCurrencyService.create({
      amount,
      characterId,
      currencyId
    });

    res.status(201).json({
      success: true,
      characterCurrency: {
        amount: newCharacterCurrency.amount,
        currencyId: newCharacterCurrency.currencyId
      }
    });
  }

  async update(
    req: Request<
      UpdateCharacterCurrencyRequestParams,
      {},
      UpdateCharacterCurrencyRequestDTO
    >,
    res: Response<UpdateCharacterCurrencyResponse>
  ) {
    const { characterCurrencyId } = req.params;
    const { amount } = req.body;

    const updatedCharacterCurrency = await this.characterCurrencyService.update(
      characterCurrencyId,
      { amount }
    );

    res.status(200).json({
      success: true,
      characterCurrency: {
        amount: updatedCharacterCurrency.amount,
        currencyId: updatedCharacterCurrency.currencyId
      }
    });
  }
}
