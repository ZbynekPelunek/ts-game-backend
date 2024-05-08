import { Request, Response } from 'express';

import {
  Request_CharacterCurrency_GET_all_query,
  Response_CharacterCurrency_GET_all,
  CharacterCurrencyFrontend,
  Currency,
  Request_CharacterCurrency_POST_body,
  Response_CharacterCurrency_POST,
  CharacterCurrencyBackend,
  Request_CharacterCurrency_PATCH_body,
  Response_CharacterCurrency_PATCH,
  Request_CharacterCurrency_PATCH_param,
} from '../../../shared/src';
import { CharacterCurrencyModel } from '../models/characterCurrency.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';
import { Document } from 'mongoose';

export class CharacterCurrencyController {
  async getAll(
    req: Request<{}, {}, {}, Request_CharacterCurrency_GET_all_query>,
    res: Response<Response_CharacterCurrency_GET_all>
  ) {
    try {
      const { characterId, populateCurrency, currencyId } = req.query;

      const query = CharacterCurrencyModel.find().lean();

      if (populateCurrency)
        query.populate<{ currencyId: Currency }>({
          path: 'currencyId',
          select: '-createdAt -updatedAt -__v',
        });
      if (characterId) query.where({ characterId });
      if (currencyId) query.where({ currencyId });

      const characterCurrencies = await query.exec();
      const transformedResponse =
        this.transformResponseArray(characterCurrencies);

      return res.status(200).json({
        success: true,
        characterCurrencies: transformedResponse,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async post(
    req: Request<{}, {}, Request_CharacterCurrency_POST_body>,
    res: Response<Response_CharacterCurrency_POST>
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

      return res
        .status(201)
        .json({ success: true, characterCurrencies: responseArr });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async patch(
    req: Request<
      Request_CharacterCurrency_PATCH_param,
      {},
      Request_CharacterCurrency_PATCH_body
    >,
    res: Response<Response_CharacterCurrency_PATCH>
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

      return res
        .status(200)
        .json({ success: true, characterCurrency: transformedResponse });
    } catch (error) {
      errorHandler(error, req, res);
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
      currencyId: databaseResponse.currencyId,
    };
  }

  private transformResponseArray(
    databaseResponse: CharacterCurrencyBackend[]
  ): CharacterCurrencyFrontend[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
