import { NextFunction, Request, Response } from 'express-serve-static-core';

import {
  ListInventoriesRequestQuery,
  ListInventoriesResponse,
  GetInventoryRequestParams,
  GetInventoryResponse,
  CreateInventoryRequestBody,
  CreateInventoryResponse,
  UpdateInventoryRequestParams,
  UpdateInventoryResponse,
  GetItemResponse,
  InventoryFrontend,
  DeleteInventoryRequestParams,
  DeleteInventoryResponse,
  InventoryBackend,
  CommonItemParams,
  CommonItemsEquipmenParams,
  InventoryItem,
  UpdateInventoryRequestBody
} from '../../../shared/src';
import { generateCharacterInventory } from '../defaultCharacterData/inventory';
import { InventoryModel } from '../models/inventory.model';
import { ApiService, PUBLIC_ROUTES } from '../services/apiService';
import { CustomError, errorHandler } from '../middleware/errorHandler';
import { SellItemCommand } from '../commands/inventory/sellItem';
import { CharacterCurrencyService } from '../services/characterCurrencyService';
import { InventoryService } from '../services/inventoryService';
import { ItemService } from '../services/itemService';

export class InventoryController {
  private sellItemCommand: SellItemCommand;
  private apiService: ApiService;

  constructor() {
    const inventoryService = new InventoryService();
    const itemService = new ItemService();
    const characterCurrencyService = new CharacterCurrencyService();
    this.sellItemCommand = new SellItemCommand(
      inventoryService,
      itemService,
      characterCurrencyService
    );
    this.apiService = new ApiService();
  }

  async list(
    req: Request<{}, {}, {}, ListInventoriesRequestQuery>,
    res: Response<ListInventoriesResponse>,
    _next: NextFunction
  ) {
    try {
      const { characterId, slot, populateItem } = req.query;

      const query = InventoryModel.find().sort({ slot: 1 }).lean();

      if (characterId) query.where({ characterId });
      if (slot) query.where({ slot: +slot });
      if (populateItem === 'true')
        query.populate<{ itemId: CommonItemParams }>({
          path: 'item.itemId',
          select: '-createdAt -updatedAt -__v',
          localField: 'itemId',
          foreignField: 'itemId'
        });

      const inventory = await query.exec();
      const transformedInventory = this.transformResponseArray(inventory);

      res
        .status(200)
        .json({ success: true, inventories: transformedInventory });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async getOneById(
    req: Request<GetInventoryRequestParams>,
    res: Response<GetInventoryResponse>,
    _next: NextFunction
  ) {
    try {
      const { inventoryId } = req.params;

      const inventory = await this.getInventorySlotData(inventoryId);
      const transformedInventory = this.transformResponseObject(inventory);

      res.status(200).json({ success: true, inventory: transformedInventory });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async addInventorySlot(
    req: Request<{}, {}, CreateInventoryRequestBody>,
    res: Response<CreateInventoryResponse>,
    _next: NextFunction
  ) {
    try {
      const { characterId, slot, itemId } = req.body;
      const inventoryDbResponse = await InventoryModel.create({
        characterId,
        slot,
        itemId
      });
      const transformedResponse = [
        this.transformResponseObject(inventoryDbResponse)
      ];

      res.status(201).json({ success: true, inventory: transformedResponse });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async createNewInventory(
    req: Request<{}, {}, CreateInventoryRequestBody>,
    res: Response<CreateInventoryResponse>,
    _next: NextFunction
  ) {
    try {
      const { characterId } = req.body;

      const defaultCharacterInventory = generateCharacterInventory(characterId);
      const inventoryDbResponse = await InventoryModel.create(
        defaultCharacterInventory
      );
      const transformedResponse =
        this.transformResponseArray(inventoryDbResponse);

      res.status(201).json({ success: true, inventory: transformedResponse });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async updateInventorySlot(
    req: Request<UpdateInventoryRequestParams, {}, UpdateInventoryRequestBody>,
    res: Response<UpdateInventoryResponse>,
    _next: NextFunction
  ) {
    try {
      const { inventorySlotId } = req.params;
      const { item } = req.body;

      if (item === null) {
        await this.updateInventoryItem(inventorySlotId, item);

        res.status(204).json({ success: true });
        return;
      }

      const inventorySlotToUpdate =
        await this.getInventorySlotData(inventorySlotId);

      const characterId = inventorySlotToUpdate.characterId.toString();

      if (!inventorySlotToUpdate.item) {
        await this.updateInventoryItem(inventorySlotId, item);

        res.status(204).json({ success: true });
        return;
      }

      const itemData = await this.getItemData(item.itemId);

      if (
        this.isSameItem(
          inventorySlotToUpdate.item.itemId as number,
          item.itemId
        )
      ) {
        this.checkMaxAmount(itemData, inventorySlotToUpdate.item, item.amount);

        await this.updateItemAmount(inventorySlotId, item.amount);

        res.status(204).json({ success: true });
        return;
      }

      if (item.previousSlot) {
        await this.switchItems(
          inventorySlotId,
          item.itemId,
          item.amount,
          characterId,
          item.previousSlot,
          inventorySlotToUpdate.item
        );
      } else {
        await this.addItemToFreeSlot(characterId, item.itemId, item.amount);
      }

      res.status(204).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  //TODO: add interfaces
  async addItem(req: Request, res: Response, _next: NextFunction) {
    try {
      const { characterId, itemId, amount } = req.body;

      console.log('Adding item with ID: ', itemId);

      const inventorySlot = await this.addItemToFreeSlot(
        characterId,
        itemId,
        amount
      );

      res.status(201).json({ success: true, inventory: inventorySlot });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async sellInventoryItem(
    req: Request<UpdateInventoryRequestParams>,
    res: Response<UpdateInventoryResponse>,
    _next: NextFunction
  ) {
    try {
      const { inventorySlotId } = req.params;

      await this.sellItemCommand.execute({ inventorySlotId });

      res.status(204).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async delete(
    req: Request<DeleteInventoryRequestParams>,
    res: Response<DeleteInventoryResponse>,
    _next: NextFunction
  ) {
    try {
      const { inventoryId } = req.params;

      await InventoryModel.findByIdAndDelete(inventoryId);

      res.status(204);
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  ////////////////////////////////////////////////////////////////////

  private async getItemData(
    itemId: number
  ): Promise<CommonItemParams | CommonItemsEquipmenParams> {
    const response = await this.apiService.get<GetItemResponse>(
      `${PUBLIC_ROUTES.Items}/${itemId}`
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
        $set: { item }
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
        'item.amount': inventorySlotItem.amount
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
      characterId
    })
      .sort({ slot: 1 })
      .lean();

    if (!allCharacterItemSlots) {
      throw new CustomError('No character inventory data found', 500);
    }

    const freeCharacterItemSlots = allCharacterItemSlots.filter((i) => !i.item);
    //console.log('freeCharacterItemSlots: ', freeCharacterItemSlots);

    if (freeCharacterItemSlots.length === 0) {
      console.log('INVENTORY IS FULL');
      throw new CustomError('Inventory is full', 400);
    }

    const firstFreeSlot = freeCharacterItemSlots[0];

    return InventoryModel.findOneAndUpdate(
      { slot: firstFreeSlot.slot, characterId },
      { item: { itemId, amount } },
      { returnDocument: 'after' }
    );
  }

  private transformResponseObject(
    databaseResponse: InventoryBackend
  ): InventoryFrontend {
    return {
      slot: databaseResponse.slot,
      item: databaseResponse.item,
      _id: databaseResponse._id!.toString(),
      characterId: databaseResponse.characterId.toString()
    };
  }

  private transformResponseArray(
    databaseResponse: InventoryBackend[]
  ): InventoryFrontend[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
