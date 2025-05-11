import { Types, Document, UpdateQuery } from 'mongoose';
import {
  CharacterCurrency,
  CharacterCurrencyDTO,
  CreateCharacterCurrencyRequestDTO,
  Currency,
  ListCharacterCurrenciesQuery,
  UpdateCharacterCurrencyRequestDTO
} from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler.middleware';
import { CharacterCurrencyModel } from '../models/characterCurrency.model';
import { CharacterModel } from '../models/character.model';

interface CharacterCurrencyDocument
  extends CharacterCurrency,
    Document<Types.ObjectId> {}

export class CharacterCurrencyService {
  async list(queryParams: ListCharacterCurrenciesQuery) {
    const { characterId, populateCurrency, currencyId } = queryParams;

    const query = CharacterCurrencyModel.find();

    if (populateCurrency) {
      query.populate<{ currency: Currency }>('currency');
    }
    if (characterId) query.where({ characterId });
    if (currencyId) query.where({ currencyId });

    const characterCurrencies = await query.exec();

    return this.transformResponseArray(characterCurrencies);
  }

  async create(data: CreateCharacterCurrencyRequestDTO) {
    const { amount, characterId, currencyId } = data;

    const character = await CharacterModel.findById(characterId);

    if (!character) {
      throw new CustomError(
        `Character with id '${characterId}' does not exist.`,
        400
      );
    }

    const characterCurrencyExist = await CharacterCurrencyModel.findOne({
      characterId,
      currencyId
    });

    if (characterCurrencyExist) {
      throw new CustomError(`Character has already this currency.`, 400);
    }

    return await CharacterCurrencyModel.create({
      amount,
      characterId,
      currencyId
    });
  }

  async update(
    characterCurrencyId: string,
    data: UpdateCharacterCurrencyRequestDTO
  ) {
    const { amount } = data;

    const characterCurrency =
      await CharacterCurrencyModel.findById(characterCurrencyId);

    if (!characterCurrency) {
      throw new CustomError(
        `Character currency with id '${characterCurrencyId}' not found`,
        400
      );
    }

    const updateQuery: UpdateQuery<CharacterCurrencyDocument> = {};

    if (amount) {
      if (amount < 0 && amount * -1 > characterCurrency.amount) {
        throw new CustomError('Not enough currency.', 400);
      }
      updateQuery.$inc = { amount };
    }

    if (Object.keys(updateQuery).length === 0 || amount === 0) {
      return characterCurrency;
    }

    const updatedCharacterCurrency =
      await CharacterCurrencyModel.findByIdAndUpdate(
        characterCurrencyId,
        updateQuery,
        { new: true, runValidators: true }
      );

    if (!updatedCharacterCurrency) {
      throw new CustomError('No character currency updated.', 400);
    }

    return updatedCharacterCurrency;
  }

  private transformResponseObject(
    databaseResponse: CharacterCurrencyDocument
  ): CharacterCurrencyDTO {
    const { currencyId, amount, currency, id } = databaseResponse;

    return {
      _id: id,
      currencyId,
      amount,
      currency
    };
  }

  private transformResponseArray(
    databaseResponse: CharacterCurrencyDocument[]
  ): CharacterCurrencyDTO[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
