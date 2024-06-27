import { Request, Response } from 'express';

import {
  Request_CharacterEquipment_GET_all_query,
  Response_CharacterEquipment_GET_all,
  CharacterEquipmentFrontend,
  Request_CharacterEquipment_POST_body,
  Response_CharacterEquipment_POST,
  CharacterEquipmentBackend,
  Request_CharacterEquipment_PATCH_param,
  Request_CharacterEquipment_PATCH_body,
  Response_CharacterEquipment_PATCH,
  CharacterEquipmentItem,
  CommonItemsEquipmenParams,
  Response_Item_GET_one,
  EquipmentSlot,
  Response_Inventory_GET_all,
  Request_Inventory_GET_all_query,
  Request_Inventory_PATCH_body,
  Response_Inventory_PATCH,
} from '../../../shared/src';
import {
  CharacterEquipmentModel,
  CharacterEquipmentSchema,
} from '../models/characterEquipment.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';
import { ApiService, PUBLIC_ROUTES } from '../services/api.service';
import {
  BeAnObject,
  IObjectWithTypegooseFunction,
} from '@typegoose/typegoose/lib/types';
import { Document, Types } from 'mongoose';

export class CharacterEquipmentController {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  async getAll(
    req: Request<{}, {}, {}, Request_CharacterEquipment_GET_all_query>,
    res: Response<Response_CharacterEquipment_GET_all>
  ) {
    try {
      const { characterId } = req.query;

      const query = CharacterEquipmentModel.find().lean();

      if (characterId) query.where({ characterId });

      const charEquipDbResponse = await query.exec();

      const characterEquipment: CharacterEquipmentFrontend[] =
        this.transformResponseArray(charEquipDbResponse);

      return res.status(200).json({ success: true, characterEquipment });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async post(
    req: Request<{}, {}, Request_CharacterEquipment_POST_body>,
    res: Response<Response_CharacterEquipment_POST>
  ) {
    try {
      const { characterEquipment } = req.body;

      const characterEquipmentDbRes =
        await CharacterEquipmentModel.create(characterEquipment);

      let responseArr: CharacterEquipmentFrontend[] = [];
      if (Array.isArray(characterEquipmentDbRes)) {
        responseArr = this.transformResponseArray(characterEquipmentDbRes);
      } else {
        const charEquipmentResponse: CharacterEquipmentFrontend =
          this.transformResponseObject(characterEquipmentDbRes);
        responseArr.push(charEquipmentResponse);
      }

      return res
        .status(201)
        .json({ success: true, characterEquipment: responseArr });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async equipItem(
    req: Request<
      Request_CharacterEquipment_PATCH_param,
      {},
      Request_CharacterEquipment_PATCH_body
    >,
    res: Response<Response_CharacterEquipment_PATCH>
  ) {
    try {
      const { characterEquipmentId } = req.params;
      const { item } = req.body;

      const characterEquipmentData =
        await this.getCharacterEquipmentData(characterEquipmentId);
      const characterId = characterEquipmentData.characterId.toString();
      const currentCharacterEquipmentItem = characterEquipmentData.item;

      if (currentCharacterEquipmentItem) {
        await this.sendEquippedItemToInventory(
          characterId,
          currentCharacterEquipmentItem
        );
      }

      const itemData = await this.getItemData(item!.itemId);
      if (
        !this.isItemCorrectEquipmentSlot(
          characterEquipmentData.slot,
          itemData.slot
        )
      ) {
        throw new CustomError('Wrong equipment slot', 400);
      }
      const updateRes = await this.updateCharacterEquipmentItem(
        characterEquipmentId,
        item
      );

      const response = this.transformResponseObject(
        this.checkUpdateResponse(updateRes)
      );

      return res
        .status(200)
        .json({ success: true, characterEquipment: response });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async unequipItem(
    req: Request<
      Request_CharacterEquipment_PATCH_param,
      {},
      Request_CharacterEquipment_PATCH_body
    >,
    res: Response<Response_CharacterEquipment_PATCH>
  ) {
    try {
      const { characterEquipmentId } = req.params;
      const { item } = req.body;

      const characterEquipmentData =
        await this.getCharacterEquipmentData(characterEquipmentId);
      const characterId = characterEquipmentData.characterId.toString();

      if (!item) {
        throw new CustomError('No item to unequip', 400);
      }

      await this.sendEquippedItemToInventory(characterId, item);

      const updateRes = await this.updateCharacterEquipmentItem(
        characterEquipmentId,
        null
      );

      const response = this.transformResponseObject(
        this.checkUpdateResponse(updateRes)
      );

      return res
        .status(200)
        .json({ success: true, characterEquipment: response });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  private async getCharacterEquipmentData(characterEquipmentId: string) {
    const characterEquipmentData =
      await CharacterEquipmentModel.findById(characterEquipmentId).lean();
    if (!characterEquipmentData) {
      throw new CustomError(
        `Character equipment with id '${characterEquipmentId}' does not exist`,
        404
      );
    }
    return characterEquipmentData;
  }

  private async updateCharacterEquipmentItem(
    characterEquipmentId: string,
    item: CharacterEquipmentItem | null
  ) {
    return CharacterEquipmentModel.findByIdAndUpdate(
      characterEquipmentId,
      {
        $set: { item },
      },
      { returnDocument: 'after' }
    );
  }

  private async getItemData(
    itemId: number
  ): Promise<CommonItemsEquipmenParams> {
    const response = await this.apiService.get<Response_Item_GET_one>(
      `${PUBLIC_ROUTES.Items}/${itemId}`
    );

    if (!response.success || !response.item) {
      throw new CustomError('Error while retrieving item data', 500);
    }

    return response.item as CommonItemsEquipmenParams;
  }

  private async getInventorySlotData(characterId: string, slot: number) {
    const requestQuery: Request_Inventory_GET_all_query = {
      characterId,
      slot,
    };
    const response = await this.apiService.get<Response_Inventory_GET_all>(
      PUBLIC_ROUTES.Inventory,
      { params: requestQuery }
    );

    if (!response.success) {
      throw new CustomError('Error while retrieving inventory data', 500);
    }

    return response.inventory;
  }

  private async updateInventorySlot(
    inventorySlotId: string,
    item: CharacterEquipmentItem
  ) {
    const requestQuery: Request_Inventory_PATCH_body = {
      item: {
        itemId: item.itemId,
        amount: 1,
      },
    };
    const response = await this.apiService.patch<
      Response_Inventory_PATCH,
      Request_Inventory_PATCH_body
    >(`${PUBLIC_ROUTES.Inventory}/${inventorySlotId}`, requestQuery);

    if (!response.success) {
      throw new CustomError(
        `Error while updating inventory data: ${response.error}`,
        500
      );
    }
  }

  private isItemCorrectEquipmentSlot(
    equipmentSlot: EquipmentSlot,
    itemSlot: EquipmentSlot
  ): boolean {
    return equipmentSlot === itemSlot;
  }

  private async sendEquippedItemToInventory(
    characterId: string,
    item: CharacterEquipmentItem
  ): Promise<void> {
    const inventorySlot = await this.getInventorySlotData(characterId, 1);
    const inventorySlotId = inventorySlot[0]._id;

    await this.updateInventorySlot(inventorySlotId, item);
  }

  private checkUpdateResponse(
    updateRes:
      | (Document<unknown, BeAnObject, CharacterEquipmentSchema> &
          Omit<
            CharacterEquipmentSchema & { _id: Types.ObjectId },
            'typegooseName'
          > &
          IObjectWithTypegooseFunction)
      | null
  ) {
    if (!updateRes) {
      throw new CustomError('Something went wrong while updating', 500);
    }
    return updateRes;
  }

  private transformResponseObject(
    databaseResponse: CharacterEquipmentBackend
  ): CharacterEquipmentFrontend {
    return {
      characterId: databaseResponse.characterId.toString(),
      _id: databaseResponse._id!.toString(),
      item: databaseResponse.item,
      uiPosition: databaseResponse.uiPosition,
      slot: databaseResponse.slot,
    };
  }

  private transformResponseArray(
    databaseResponse: CharacterEquipmentBackend[]
  ): CharacterEquipmentFrontend[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
