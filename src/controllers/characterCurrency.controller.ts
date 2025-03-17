import { NextFunction, Request, Response } from 'express-serve-static-core';

import {
  ListCharacterCurrenciesQuery,
  ListCharacterCurrenciesResponse,
  CharacterCurrencyFrontend,
  Currency,
  CreateCharacterCurrencyRequestBody,
  CreateCharacterCurrenciesResponse,
  CharacterCurrencyBackend,
  UpdateCharacterCurrencyRequestBody,
  UpdateCharacterCurrencyResponse,
  UpdateCharacterCurrencyRequestParams
} from '../../../shared/src';
import { CharacterCurrencyModel } from '../models/characterCurrency.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';
import { Document } from 'mongoose';

export class CharacterCurrencyController {
  async list(
    req: Request<{}, {}, {}, ListCharacterCurrenciesQuery>,
    res: Response<ListCharacterCurrenciesResponse>,
    _next: NextFunction
  ) {
    try {
      const { characterId, populateCurrency, currencyId } = req.query;

      const query = CharacterCurrencyModel.find().lean();

      if (populateCurrency)
        query.populate<{ currencyId: Currency }>({
          path: 'currencyId',
          select: '-createdAt -updatedAt -__v'
        });
      if (characterId) query.where({ characterId });
      if (currencyId) query.where({ currencyId });

      const characterCurrencies = await query.exec();
      const transformedResponse =
        this.transformResponseArray(characterCurrencies);

      res.status(200).json({
        success: true,
        characterCurrencies: transformedResponse
      });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async create(
    req: Request<{}, {}, CreateCharacterCurrencyRequestBody>,
    res: Response<CreateCharacterCurrenciesResponse>,
    _next: NextFunction
  ) {
    try {
      const { characterCurrencies } = req.body;

      const characterCurrenciesDbRes =
        await CharacterCurrencyModel.create(characterCurrencies);

      let responseArr: CharacterCurrencyFrontend[] = [];
      if (Array.isArray(characterCurrenciesDbRes)) {
        responseArr = this.transformResponseArray(characterCurrenciesDbRes);
      } else {
        const charAttributeResponse: CharacterCurrencyFrontend =
          this.transformResponseObject(characterCurrenciesDbRes);
        responseArr.push(charAttributeResponse);
      }

      res.status(201).json({ success: true, characterCurrencies: responseArr });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async update(
    req: Request<
      UpdateCharacterCurrencyRequestParams,
      {},
      UpdateCharacterCurrencyRequestBody
    >,
    res: Response<UpdateCharacterCurrencyResponse>,
    _next: NextFunction
  ) {
    try {
      const { characterCurrencyId } = req.params;
      const { amount } = req.body;

      const characterCurrencyData =
        await CharacterCurrencyModel.findById(characterCurrencyId).lean();
      if (!characterCurrencyData) {
        throw new CustomError(
          `Character currency with id '${characterCurrencyId}' does not exist`,
          404
        );
      }

      const updatedCharacterCurrency =
        await CharacterCurrencyModel.findByIdAndUpdate(
          characterCurrencyId,
          { $inc: { amount } },
          { returnDocument: 'after' }
        );

      const transformedResponse = this.transformResponseObject(
        this.checkUpdateResponse(updatedCharacterCurrency)
      );

      res
        .status(200)
        .json({ success: true, characterCurrency: transformedResponse });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  private checkUpdateResponse(
    updateRes: (Document & CharacterCurrencyBackend) | null
  ) {
    if (!updateRes) {
      throw new CustomError('Something went wrong while updating', 500);
    }
    return updateRes;
  }

  private transformResponseObject(
    databaseResponse: CharacterCurrencyBackend
  ): CharacterCurrencyFrontend {
    return {
      amount: databaseResponse.amount,
      _id: databaseResponse._id!.toString(),
      characterId: databaseResponse.characterId.toString(),
      currencyId: databaseResponse.currencyId
    };
  }

  private transformResponseArray(
    databaseResponse: CharacterCurrencyBackend[]
  ): CharacterCurrencyFrontend[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
