import axios from 'axios';
import { Request, Response } from 'express';
import { Document } from 'mongoose';

import {
  Request_Inventory_GET_all_query,
  Response_Inventory_GET_all,
  Request_Inventory_GET_item_param,
  Response_Inventory_GET_one,
  Request_Inventory_POST_body,
  Request_Inventory_POST_query,
  Response_Inventory_POST,
  InventoryActions,
  Request_Inventory_PATCH_param,
  Request_Inventory_PATCH_body,
  Response_Inventory_PATCH,
  Response_Item_GET_one,
  InventoryFrontend,
} from '../../../shared/src';
import { generateCharacterInventory } from '../defaultCharacterData/inventory';
import { InventoryModel, InventorySchema } from '../models/inventory.model';
import { FULL_PUBLIC_ROUTES } from '../services/api.service';

export class InventoryController {
  async getAll(
    req: Request<{}, {}, {}, Request_Inventory_GET_all_query>,
    res: Response<Response_Inventory_GET_all>
  ) {
    try {
      const { characterId } = req.query;

      const query = InventoryModel.find().lean();

      if (characterId) query.where({ characterId });

      const inventory = await query.exec();
      const transformedInventory = inventory.map((inv) => {
        return {
          inventoryId: inv._id.toString(),
          characterId: inv.characterId.toString(),
          amount: inv.amount ?? 0,
          itemId: inv.itemId,
          slot: inv.slot,
        };
      });

      return res
        .status(200)
        .json({ success: true, inventory: transformedInventory });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Inventory Get All Error [TBI]' });
    }
  }

  async getOneById(
    req: Request<Request_Inventory_GET_item_param>,
    res: Response<Response_Inventory_GET_one>
  ) {
    try {
      const { inventoryId } = req.params;

      const inventory = await InventoryModel.findById(inventoryId);

      if (!inventory) {
        return res.status(404).json({
          success: false,
          error: `Inventory with id '${inventoryId}' not found`,
        });
      }

      return res
        .status(200)
        .json({ success: true, inventory: this.transformResponse(inventory) });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Inventory Get One Error [TBI]' });
    }
  }

  async post(
    req: Request<
      {},
      {},
      Request_Inventory_POST_body,
      Request_Inventory_POST_query
    >,
    res: Response<Response_Inventory_POST>
  ) {
    try {
      const { action } = req.query;

      let response;
      if (action === InventoryActions.NEW) {
        const { characterId } = req.body;
        console.log(
          'creating new character inventory for character: ',
          characterId
        );
        const defaultCharacterInventory =
          generateCharacterInventory(characterId);
        const inventoryDbResponse = await InventoryModel.create(
          defaultCharacterInventory
        );
        response = inventoryDbResponse.map((ii) => {
          return this.transformResponse(ii);
        });
      } else {
        const { characterId, slot, itemId } = req.body;
        const inventoryDbResponse = await InventoryModel.create({
          characterId,
          slot,
          itemId,
        });
        response = [this.transformResponse(inventoryDbResponse)];
      }

      return res.status(201).json({ success: true, inventory: response });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Inventory Post Error [TBI]' });
    }
  }

  async patch(
    req: Request<
      Request_Inventory_PATCH_param,
      {},
      Request_Inventory_PATCH_body
    >,
    res: Response<Response_Inventory_PATCH>
  ) {
    try {
      const { inventoryId } = req.params;
      const { characterId, itemId, amount, previousItemSlot } = req.body;

      console.log('Looking for item data...');
      const item = await axios.get<Response_Item_GET_one>(
        `${FULL_PUBLIC_ROUTES.Items}/${itemId}`
      );
      if (!item.data.success) {
        return res.status(500).json({
          success: false,
          error: 'Error while retrieving item data',
        });
      }

      if (!item.data.item) {
        return res
          .status(500)
          .json({ success: false, error: 'Item not found' });
      }
      console.log('...found item data: ', item.data.item);

      console.log('Getting all inventory slots data...');

      const inventorySlotItem = await InventoryModel.findById(inventoryId);
      console.log('...found inventory slots data: ', inventorySlotItem);
      if (!inventorySlotItem) {
        return res.status(404).json({
          success: false,
          error: `Inventory item with id '${inventoryId}' does not exist`,
        });
      }

      let updateRes;
      if (inventorySlotItem.itemId === item.data.item.itemId) {
        if (inventorySlotItem.amount! + amount! > item.data.item.maxAmount!) {
          return res.status(400).json({
            success: false,
            error: `Max amount reached ${inventorySlotItem.amount! + amount!}/${item.data.item.maxAmount}`,
          });
        }

        updateRes = await InventoryModel.findByIdAndUpdate(
          inventoryId,
          { $inc: { amount } },
          { returnDocument: 'after' }
        );
        console.log('Update db response: ', updateRes);

        const response = this.transformResponse(updateRes!);

        return res.status(200).json({ success: true, inventory: response });
      }

      if (!inventorySlotItem.itemId) {
        console.log('Updating itemId in slot: ', inventorySlotItem.slot);
        updateRes = await InventoryModel.findByIdAndUpdate(
          inventoryId,
          { $set: { amount, characterId, itemId } },
          { returnDocument: 'after' }
        );
        console.log('Update db response: ', updateRes);

        const response = this.transformResponse(updateRes!);

        return res.status(200).json({ success: true, inventory: response });
      } else {
        if (previousItemSlot) {
          console.log(
            `'Switching item ${inventorySlotItem.itemId} with ${itemId}`
          );
          updateRes = await InventoryModel.findByIdAndUpdate(
            inventoryId,
            { itemId, amount },
            { returnDocument: 'after' }
          );
          console.log('Update db response: ', updateRes);

          await InventoryModel.findOneAndUpdate(
            { slot: previousItemSlot },
            {
              itemId: inventorySlotItem.itemId,
              amount: inventorySlotItem.amount,
            }
          );

          const response = this.transformResponse(updateRes!);

          return res.status(200).json({ success: true, inventory: response });
        } else {
          const allCharacterItemSlots = await InventoryModel.find({
            characterId,
          });

          if (!allCharacterItemSlots) {
            return res.status(500).json({
              success: false,
              error: 'No character inventory data found',
            });
          }

          const freeCharacterItemSlots = allCharacterItemSlots.filter(
            (i) => !i.itemId
          );
          console.log('freeCharacterItemSlots: ', freeCharacterItemSlots);

          if (freeCharacterItemSlots.length === 0) {
            return res.status(500).json({
              success: false,
              error: 'Inventory is full',
            });
          }

          const firstFreeSlot = freeCharacterItemSlots[0];

          updateRes = await InventoryModel.findOneAndUpdate(
            { slot: firstFreeSlot.slot, characterId },
            { itemId, amount },
            { returnDocument: 'after' }
          );
          console.log('Update db response: ', updateRes);

          const response = this.transformResponse(updateRes!);

          return res.status(200).json({ success: true, inventory: response });
        }
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Inventory Patch Error [TBI]' });
    }
  }

  private transformResponse(
    databaseResponse: InventorySchema & Document
  ): InventoryFrontend {
    return {
      inventoryId: databaseResponse.id,
      characterId: databaseResponse.characterId.toString(),
      amount: databaseResponse.amount ?? 0,
      itemId: databaseResponse.itemId,
      slot: databaseResponse.slot,
    };
  }
}
