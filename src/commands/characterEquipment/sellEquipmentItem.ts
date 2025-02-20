import { CustomError } from '../../middleware/errorHandler';
import { startTransaction } from '../../mongoDB.handler';
import { CharacterAttributeService } from '../../services/characterAttributeService';
import { CharacterCurrencyService } from '../../services/characterCurrencyService';
import { CharacterEquipmentService } from '../../services/characterEquipmentService';
import { ItemService } from '../../services/itemService';

export class SellEquipmentItemCommand {
  constructor(
    private characterEquipmentService: CharacterEquipmentService,
    private characterCurrencyService: CharacterCurrencyService,
    private characterAttributeService: CharacterAttributeService,
    private itemService: ItemService
  ) {}

  async execute(characterEquipmentId: string) {
    const session = await startTransaction();
    const characterEquipmentData =
      await this.characterEquipmentService.getById(characterEquipmentId);
    const characterId = characterEquipmentData.characterId.toString();
    const itemToSell = characterEquipmentData.itemId;

    if (!itemToSell) {
      throw new CustomError('No item to sell', 400);
    }

    const equippedItem = await this.itemService.getById({
      itemId: itemToSell,
    });

    const { currencyId, value } = equippedItem.sell;

    try {
      session.startTransaction();

      await this.characterEquipmentService.updateEquipmentItem(
        characterEquipmentId,
        null
      );

      await this.characterCurrencyService.updateCharacterCurrency({
        characterId,
        currencyId,
        totalAmountIncrease: value,
      });

      await this.characterAttributeService.decreaseMultipleAttributeEquipmentValues(
        {
          characterId,
          attributes: equippedItem.attributes,
        }
      );

      await session.commitTransaction();
    } catch (error) {
      console.error('Sell item from equipment transaction error: ', error);
      await session.abortTransaction();
      throw new CustomError('Error while selling item from Equipment', 500);
    } finally {
      session.endSession();
    }
  }
}
