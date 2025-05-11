import { CustomError } from '../../middleware/errorHandler.middleware';
import { CharacterCurrencyModel } from '../../models/characterCurrency.model';
import { startTransaction } from '../../mongoDB.handler';
import { InventoryService } from '../../services/inventory.service';
import { ItemService } from '../../services/item.service';

export class SellItemCommand {
  constructor(
    private inventoryService: InventoryService,
    private itemService: ItemService
  ) {}

  async execute(params: { inventorySlotId: string }) {
    const { inventorySlotId } = params;

    const inventorySlotData = await this.inventoryService.getInventorySlotById({
      inventorySlotId
    });
    const characterId = inventorySlotData.characterId.toString();
    const itemId = inventorySlotData.item?.itemId as number;
    const itemData = await this.itemService.getById({ itemId });

    const { currencyId, value } = itemData.sell;

    const totalAmountIncrease = value * inventorySlotData.item?.amount!;

    const session = await startTransaction();

    try {
      session.startTransaction();

      await this.inventoryService.updateInventoryItem(inventorySlotId, null);

      await CharacterCurrencyModel.updateOne(
        {
          characterId,
          currencyId
        },
        { $inc: { amount: totalAmountIncrease } }
      );

      await session.commitTransaction();
    } catch (error) {
      console.error('Sell Item transaction error: ', error);
      await session.abortTransaction();
      throw new CustomError('Error while selling item from inventory', 500);
    } finally {
      session.endSession();
    }
  }
}
