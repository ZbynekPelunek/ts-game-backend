import { Request, Response } from 'express';

import {
  Request_Inventory_GET_all_query,
  Response_Inventory_GET_all,
  Request_Inventory_GET_item_param,
  Response_Inventory_GET_one,
  Request_Inventory_POST_body,
  Response_Inventory_POST,
  Request_Inventory_PATCH_param,
  Request_Inventory_PATCH_body,
  Response_Inventory_PATCH,
  Response_Item_GET_one,
  InventoryFrontend,
  Request_Inventory_DELETE_param,
  Response_Inventory_DELETE,
  InventoryBackend,
  CommonItemParams,
  CommonItemsEquipmenParams,
  InventoryItem,
  Response_CharacterCurrency_GET_all,
  Request_CharacterCurrency_GET_all_query,
  Response_CharacterCurrency_PATCH,
  Request_CharacterCurrency_PATCH_body,
  CurrencyId,
} from '../../../shared/src';
import { generateCharacterInventory } from '../defaultCharacterData/inventory';
import { InventoryModel } from '../models/inventory.model';
import { ApiService, FULL_PUBLIC_ROUTES } from '../services/api.service';
import { CustomError, errorHandler } from '../middleware/errorHandler';
import { Document } from 'mongoose';

export class InventoryController {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  async getAll(
    req: Request<{}, {}, {}, Request_Inventory_GET_all_query>,
    res: Response<Response_Inventory_GET_all>
  ) {
    try {
      const { characterId } = req.query;

      const query = InventoryModel.find().lean();

      if (characterId) query.where({ characterId });

      const inventory = await query.exec();
      const transformedInventory = this.transformResponseArray(inventory);

      return res
        .status(200)
        .json({ success: true, inventory: transformedInventory });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getOneById(
    req: Request<Request_Inventory_GET_item_param>,
    res: Response<Response_Inventory_GET_one>
  ) {
    try {
      const { inventoryId } = req.params;

      const inventory = await this.getInventorySlotData(inventoryId);
      const transformedInventory = this.transformResponseObject(inventory);

      return res
        .status(200)
        .json({ success: true, inventory: transformedInventory });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async addInventorySlot(
    req: Request<{}, {}, Request_Inventory_POST_body>,
    res: Response<Response_Inventory_POST>
  ) {
    try {
      const { characterId, slot, itemId } = req.body;
      const inventoryDbResponse = await InventoryModel.create({
        characterId,
        slot,
        itemId,
      });
      const transformedResponse = [
        this.transformResponseObject(inventoryDbResponse),
      ];

      return res
        .status(201)
        .json({ success: true, inventory: transformedResponse });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async createNewInventory(
    req: Request<{}, {}, Request_Inventory_POST_body>,
    res: Response<Response_Inventory_POST>
  ) {
    try {
      const { characterId } = req.body;

      const defaultCharacterInventory = generateCharacterInventory(characterId);
      const inventoryDbResponse = await InventoryModel.create(
        defaultCharacterInventory
      );
      const transformedResponse =
        this.transformResponseArray(inventoryDbResponse);

      return res
        .status(201)
        .json({ success: true, inventory: transformedResponse });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async updateInventorySlot(
    req: Request<
      Request_Inventory_PATCH_param,
      {},
      Request_Inventory_PATCH_body
    >,
    res: Response<Response_Inventory_PATCH>
  ) {
    try {
      const { inventoryId } = req.params;
      const { item } = req.body;

      if (item === null) {
        const updateRes = await this.updateInventoryItem(inventoryId, item);

        const response = this.transformResponseObject(
          this.checkUpdateResponse(updateRes)
        );

        return res.status(200).json({ success: true, inventory: response });
      }

      const inventorySlotToUpdate =
        await this.getInventorySlotData(inventoryId);

      const characterId = inventorySlotToUpdate.characterId.toString();

      if (!inventorySlotToUpdate.item) {
        const updateRes = await this.updateInventoryItem(inventoryId, item);

        const response = this.transformResponseObject(
          this.checkUpdateResponse(updateRes)
        );

        return res.status(200).json({ success: true, inventory: response });
      }

      const itemData = await this.getItemData(item.itemId);

      if (this.isSameItem(inventorySlotToUpdate.item.itemId, item.itemId)) {
        this.checkMaxAmount(itemData, inventorySlotToUpdate.item, item.amount);

        const updateRes = await this.updateItemAmount(inventoryId, item.amount);

        const response = this.transformResponseObject(
          this.checkUpdateResponse(updateRes)
        );

        return res.status(200).json({ success: true, inventory: response });
      }

      let updateRes;
      if (item.previousSlot) {
        updateRes = await this.switchItems(
          inventoryId,
          item.itemId,
          item.amount,
          characterId,
          item.previousSlot,
          inventorySlotToUpdate.item
        );
      } else {
        updateRes = await this.addItemToFreeSlot(
          characterId,
          item.itemId,
          item.amount
        );
      }
      const response = this.transformResponseObject(
        this.checkUpdateResponse(updateRes)
      );

      return res.status(200).json({ success: true, inventory: response });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async sellInventoryItem(
    req: Request<
      Request_Inventory_PATCH_param,
      {},
      Request_Inventory_PATCH_body
    >,
    res: Response<Response_Inventory_PATCH>
  ) {
    try {
      const { inventoryId } = req.params;
      const { item } = req.body;

      const inventorySlotData = await this.getInventorySlotData(inventoryId);
      const characterId = inventorySlotData.characterId.toString();

      const updateRes = await this.updateInventoryItem(inventoryId, null);

      const itemData = await this.getItemData(item!.itemId);
      const { currencyId, value } = itemData.sell;

      const charCurrencyRes = await this.getCharacterCurrencyData(
        characterId,
        currencyId
      );

      const totalAmountIncrease = value * item?.amount!;
      await this.updateCharacterCurrency(
        charCurrencyRes.characterCurrencies[0]._id,
        totalAmountIncrease
      );

      const response = this.transformResponseObject(
        this.checkUpdateResponse(updateRes)
      );

      return res.status(200).json({ success: true, inventory: response });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async delete(
    req: Request<Request_Inventory_DELETE_param>,
    res: Response<Response_Inventory_DELETE>
  ) {
    try {
      const { inventoryId } = req.params;

      await InventoryModel.findByIdAndDelete(inventoryId);

      return res.status(204);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  private async getItemData(
    itemId: number
  ): Promise<CommonItemParams | CommonItemsEquipmenParams> {
    const response = await this.apiService.get<Response_Item_GET_one>(
      `${FULL_PUBLIC_ROUTES.Items}/${itemId}`
    );

    if (!response.success || !response.item) {
      throw new CustomError('Error while retrieving item data', 500);
    }

    return response.item;
  }

  private async getInventorySlotData(inventoryId: string) {
    const inventorySlotData = await InventoryModel.findById(inventoryId).lean();
    if (!inventorySlotData) {
      throw new CustomError(
        `Inventory slot with id '${inventoryId}' does not exist`,
        404
      );
    }

    return inventorySlotData;
  }

  private async getCharacterCurrencyData(
    characterId?: string,
    currencyId?: CurrencyId
  ) {
    const charCurrencyQuery: Request_CharacterCurrency_GET_all_query = {
      characterId,
      currencyId,
    };
    const charCurrencyRes =
      await this.apiService.get<Response_CharacterCurrency_GET_all>(
        FULL_PUBLIC_ROUTES.CharacterCurrencies,
        { params: charCurrencyQuery }
      );

    if (!charCurrencyRes.success) {
      throw new CustomError(
        'Error while retrieving character currency data',
        500
      );
    }

    return charCurrencyRes;
  }

  private async updateCharacterCurrency(
    characterCurrencyId: string,
    amount: number
  ): Promise<void> {
    const updateCharCurrRes = await this.apiService.patch<
      Response_CharacterCurrency_PATCH,
      Request_CharacterCurrency_PATCH_body
    >(`${FULL_PUBLIC_ROUTES.CharacterCurrencies}/${characterCurrencyId}`, {
      amount,
    });

    if (!updateCharCurrRes.success) {
      throw new CustomError(
        'Error while updating character currency data',
        500
      );
    }
  }

  private isSameItem(inventoryItemId: number, receivedItemId: number): boolean {
    return inventoryItemId === receivedItemId;
  }

  private checkMaxAmount(
    item: CommonItemParams | CommonItemsEquipmenParams,
    inventorySlotItem: InventoryItem,
    amount: number
  ): void {
    if (inventorySlotItem.amount + amount > item.maxAmount!) {
      throw new CustomError(
        `Max amount reached ${inventorySlotItem.amount + amount}/${item.maxAmount}`,
        400
      );
    }
  }

  private async updateItemAmount(inventoryId: string, amount: number) {
    return InventoryModel.findByIdAndUpdate(
      inventoryId,
      { $inc: { 'item.amount': amount } },
      { returnDocument: 'after' }
    );
  }

  private async updateInventoryItem(
    inventoryId: string,
    item: {
      itemId: number;
      amount: number;
    } | null
  ) {
    return InventoryModel.findByIdAndUpdate(
      inventoryId,
      {
        $set: { item },
      },
      { returnDocument: 'after' }
    );
  }

  private async switchItems(
    inventoryId: string,
    itemId: number,
    amount: number,
    characterId: string,
    previousItemSlot: number,
    inventorySlotItem: InventoryItem
  ) {
    const updateResponse = await InventoryModel.findByIdAndUpdate(
      inventoryId,
      { 'item.itemId': itemId, 'item.amount': amount },
      { returnDocument: 'after' }
    );

    await InventoryModel.findOneAndUpdate(
      { characterId, slot: previousItemSlot },
      {
        'item.itemId': inventorySlotItem.itemId,
        'item.amount': inventorySlotItem.amount,
      }
    );

    return updateResponse;
  }

  private async addItemToFreeSlot(
    characterId: string,
    itemId: number,
    amount: number
  ) {
    const allCharacterItemSlots = await InventoryModel.find({
      characterId,
    });

    if (!allCharacterItemSlots) {
      throw new CustomError('No character inventory data found', 500);
    }

    const freeCharacterItemSlots = allCharacterItemSlots.filter((i) => !i.item);
    console.log('freeCharacterItemSlots: ', freeCharacterItemSlots);

    if (freeCharacterItemSlots.length === 0) {
      throw new CustomError('Inventory is full', 500);
    }

    const firstFreeSlot = freeCharacterItemSlots[0];

    return InventoryModel.findOneAndUpdate(
      { slot: firstFreeSlot.slot, characterId },
      { item: { itemId, amount } },
      { returnDocument: 'after' }
    );
  }

  private checkUpdateResponse(updateRes: (Document & InventoryBackend) | null) {
    if (!updateRes) {
      throw new CustomError('Something went wrong while updating', 500);
    }
    return updateRes;
  }

  private transformResponseObject(
    databaseResponse: InventoryBackend
  ): InventoryFrontend {
    return {
      slot: databaseResponse.slot,
      item: databaseResponse.item,
      _id: databaseResponse._id!.toString(),
      characterId: databaseResponse.characterId.toString(),
    };
  }

  private transformResponseArray(
    databaseResponse: InventoryBackend[]
  ): InventoryFrontend[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
