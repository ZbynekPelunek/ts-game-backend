import {
  CharacterCurrencyBackend,
  CharacterCurrencyFrontend,
  CurrencyId,
} from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler';
import { CharacterCurrencyModel } from '../models/characterCurrency.model';

export class CharacterCurrencyService {
  async updateCharacterCurrency(body: {
    characterId: string;
    currencyId: CurrencyId;
    totalAmountIncrease: number;
  }) {
    const { characterId, currencyId, totalAmountIncrease } = body;

    const updatedCharacterCurrency =
      await CharacterCurrencyModel.findOneAndUpdate(
        { characterId, currencyId },
        { $inc: { amount: totalAmountIncrease } },
        { returnDocument: 'after' }
      );
    console.log(
      'CharacterCurrencyService.updateCharacterCurrency().updatedCharacterCurrency',
      updatedCharacterCurrency
    );

    if (!updatedCharacterCurrency) {
      throw new CustomError('Something went wrong while updating', 500);
    }

    return this.transformResponseObject(updatedCharacterCurrency);
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
