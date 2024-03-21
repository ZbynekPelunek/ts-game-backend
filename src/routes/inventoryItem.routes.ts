import express, { Request, Response } from 'express';
import axios from 'axios';
import { Document } from 'mongoose';

import { InventoryItemModel, InventoryItemSchema } from '../schema/inventoryItem.schema';
import { generateCharacterInventory } from '../defaultCharacterData/inventory';
import { InventoryItemBackend, InventoryItemFrontend, Request_Inventories_GET_all_query, Request_Inventories_GET_item_param, Request_Inventories_POST_body, Request_Inventories_PATCH_body, Request_Inventories_PATCH_param, Response_Inventories_GET_all, Response_Inventories_GET_one, Response_Inventories_POST, Response_Items_GET_one, Response_Inventories_PATCH } from '../../../shared/src';

export const inventoryItemsRouter = express.Router();

export enum InventoryActions {
  NEW = 'createNew'
}

inventoryItemsRouter.get('', async (req: Request<{}, {}, {}, Request_Inventories_GET_all_query>, res: Response<Response_Inventories_GET_all>) => {
  const { characterId } = req.query;

  let inventoryItems;
  if (characterId) {
    inventoryItems = await InventoryItemModel.find({ characterId });
  } else {
    inventoryItems = await InventoryItemModel.find();
  }

  const response = inventoryItems.map(invItem => {
    return transformResponse(invItem);
  })

  return res.status(200).json({ success: true, inventoryItems: response });
})

inventoryItemsRouter.get('/:inventoryItemId', async (req: Request<Request_Inventories_GET_item_param>, res: Response<Response_Inventories_GET_one>) => {
  const { inventoryItemId } = req.params;

  const inventoryItem = await InventoryItemModel.findById(inventoryItemId);

  if (!inventoryItem) {
    return res.status(404).json({ success: false, error: `Inventory item with id '${inventoryItemId}' not found` });
  }

  return res.status(200).json({ success: true, inventoryItem: transformResponse(inventoryItem) });
})

inventoryItemsRouter.post('', async (req: Request<{}, {}, Request_Inventories_POST_body, { action: string }>, res: Response<Response_Inventories_POST>) => {
  try {
    const { action } = req.query;

    let response;
    if (action === InventoryActions.NEW) {
      const { characterId } = req.body;
      console.log('creating new character inventory for character: ', characterId);
      const defaultCharacterInventory = generateCharacterInventory(characterId);
      const inventoryDbResponse = await InventoryItemModel.create(defaultCharacterInventory);
      response = inventoryDbResponse.map(ii => {
        return transformResponse(ii);
      });
    } else {
      const { characterId, slot, itemId } = req.body;
      const inventoryDbResponse = await InventoryItemModel.create({ characterId, slot, itemId });
      response = [transformResponse(inventoryDbResponse)];
    }

    return res.status(201).json({ success: true, inventoryItems: response });
  } catch (error) {
    console.error('Inventory Item POST error: ', error);
    return res.status(500).json({ success: false, error })
  }
})

inventoryItemsRouter.patch('/:inventoryItemId', async (req: Request<Request_Inventories_PATCH_param, {}, Request_Inventories_PATCH_body>, res: Response<Response_Inventories_PATCH>) => {
  const { inventoryItemId } = req.params;
  const { characterId, itemId, amount, previousItemSlot } = req.body;

  try {
    console.log('Looking for item data...');
    const item = await axios.get<Response_Items_GET_one>(`http://localhost:3000/api/v1/items/${itemId}`);
    if (!item.data.success) {
      return res.status(500).json({ success: false, error: 'Error while retrieving item data' });
    }

    if (!item.data.item) {
      return res.status(500).json({ success: false, error: 'Item not found' });
    }
    console.log('...found item data: ', item.data.item);

    console.log('Getting all inventory slots data...');
    //const inventorySlotItem = await axios.get<Response_Inventories_GET_one>(`http://localhost:3000/api/v1/inventory-items/${inventoryItemId}`)
    const inventorySlotItem = await InventoryItemModel.findById(inventoryItemId);
    console.log('...found inventory slots data: ', inventorySlotItem);
    if (!inventorySlotItem) {
      return res.status(404).json({ success: false, error: `Inventory item with id '${inventoryItemId}' does not exist` })
    }

    let updateRes;
    if (inventorySlotItem.itemId === item.data.item.itemId) {
      if (inventorySlotItem.amount! + amount! > item.data.item.maxAmount!) {
        return res.status(400).json({ success: false, error: `Max amount reached ${inventorySlotItem.amount! + amount!}/${item.data.item.maxAmount}` });
      }

      updateRes = await InventoryItemModel.findByIdAndUpdate(inventoryItemId, { $inc: { amount } }, { returnDocument: 'after' });
      console.log('Update db response: ', updateRes);

      const response = transformResponse(updateRes!);

      return res.status(200).json({ success: true, inventoryItem: response });
    }

    if (!inventorySlotItem.itemId) {
      console.log('Updating itemId in slot: ', inventorySlotItem.slot);
      updateRes = await InventoryItemModel.findByIdAndUpdate(inventoryItemId, { $set: { amount, characterId, itemId } }, { returnDocument: 'after' });
      console.log('Update db response: ', updateRes);

      const response = transformResponse(updateRes!);

      return res.status(200).json({ success: true, inventoryItem: response });
    } else {
      if (previousItemSlot) {
        console.log(`'Switching item ${inventorySlotItem.itemId} with ${itemId}`);
        updateRes = await InventoryItemModel.findByIdAndUpdate(inventoryItemId, { itemId, amount }, { returnDocument: 'after' });
        console.log('Update db response: ', updateRes);

        await InventoryItemModel.findOneAndUpdate({ slot: previousItemSlot }, { itemId: inventorySlotItem.itemId, amount: inventorySlotItem.amount });

        const response = transformResponse(updateRes!);

        return res.status(200).json({ success: true, inventoryItem: response });
      } else {
        //const allCharacterItemSlots = await axios.get<Response_Inventories_GET_all>(`http://localhost:3000/api/v1/inventory-items?characterId=${characterId}`);
        const allCharacterItemSlots = await InventoryItemModel.find({ characterId });

        if (!allCharacterItemSlots) {
          return res.status(500).json({ success: false, error: 'No character inventory data found' });
        }

        const freeCharacterItemSlots = allCharacterItemSlots.filter(i => !i.itemId);
        console.log('freeCharacterItemSlots: ', freeCharacterItemSlots);

        if (freeCharacterItemSlots.length === 0) {
          return res.status(500).json({ success: false, error: 'Inventory is full' });
        }

        const firstFreeSlot = freeCharacterItemSlots[0];

        updateRes = await InventoryItemModel.findOneAndUpdate({ slot: firstFreeSlot.slot, characterId }, { itemId, amount }, { returnDocument: 'after' });
        console.log('Update db response: ', updateRes);

        const response = transformResponse(updateRes!);

        return res.status(200).json({ success: true, inventoryItem: response });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
})

const transformResponse = (databaseResponse: InventoryItemSchema & Document): InventoryItemFrontend => {
  return {
    inventoryItemId: databaseResponse.id,
    characterId: databaseResponse.characterId.toString(),
    amount: databaseResponse.amount ?? 0,
    itemId: databaseResponse.itemId,
    slot: databaseResponse.slot
  }
}