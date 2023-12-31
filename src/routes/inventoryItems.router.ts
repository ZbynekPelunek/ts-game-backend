import express, { Request, Response } from 'express';

import { InventoryItemModel } from '../schema/inventoryItem.schema';
import { generateCharacterInventory } from '../defaultCharacterData/inventory';
import { InventoryItemBackend, Request_Inventories_GET_all_query, Request_Inventories_POST_body, Request_Inventories_POST_item_body, Request_Inventories_POST_item_param } from '../../../shared/src';
import axios from 'axios';

export const inventoryItemsRouter = express.Router();

inventoryItemsRouter.get('', async (req: Request<{}, {}, {}, Request_Inventories_GET_all_query>, res: Response) => {
  const { characterId } = req.query;

  const inventoryItems = await InventoryItemModel.find({ characterId });

  return res.status(200).json({ success: true, inventoryItems });
})

inventoryItemsRouter.get('/:slot', async (req: Request<{ slot: number }, {}, {}, Request_Inventories_GET_all_query>, res: Response) => {
  const { slot } = req.params;
  const { characterId } = req.query;

  const inventoryItem = await InventoryItemModel.findOne({ slot, characterId });

  return res.status(200).json({ success: true, inventoryItem });
})

inventoryItemsRouter.post('', async (req: Request<{}, {}, Request_Inventories_POST_body>, res: Response) => {
  const { characterId, maxInventorySlot } = req.body;
  console.log('creating character inventory for character: ', characterId);

  const defaultCharacterInventory = generateCharacterInventory(characterId, maxInventorySlot);

  const characterInventory = await InventoryItemModel.create(defaultCharacterInventory);

  return res.status(201).json({ success: true, inventory: characterInventory });
})

inventoryItemsRouter.patch('/:slot', async (req: Request<Request_Inventories_POST_item_param, {}, Request_Inventories_POST_item_body>, res: Response) => {
  const { slot } = req.params;
  const { characterId, itemId, amount, previousItemSlot } = req.body;

  try {
    console.log('Looking for item data...');
    const item = await axios.get(`http://localhost:3000/api/v1/items/${itemId}`);
    console.log('...found item data: ', item.data.item);

    console.log('Getting all inventory slots data...');
    const inventorySlotItem = await axios.get(`http://localhost:3000/api/v1/inventory-items/${slot}?characterId=${characterId}`)
    console.log('...found inventory slots data: ', inventorySlotItem.data.inventoryItem);

    let updateRes;
    if (inventorySlotItem.data.inventoryItem.itemId === item.data.item.itemId) {
      if (inventorySlotItem.data.inventoryItem.amount + 1 > item.data.item.maxAmount) {
        return res.status(500).json({ succes: false, error: `Max amount reached ${amount}/${item.data.item.maxAmount}` });
      }

      updateRes = await InventoryItemModel.updateOne({ slot, characterId }, { amount: inventorySlotItem.data.inventoryItem.amount + 1 });
      console.log('Update db response: ', updateRes);

      return res.status(200).json({ success: true });
    }

    if (inventorySlotItem.data.inventoryItem.itemId === 0) {
      console.log('Updating itemId in slot: ', slot);
      updateRes = await InventoryItemModel.updateOne({ slot, characterId }, { itemId, amount });
      console.log('Update db response: ', updateRes);

      return res.status(200).json({ success: true });
    } else {
      if (previousItemSlot) {
        await InventoryItemModel.updateOne({ previousItemSlot, characterId }, { itemId: inventorySlotItem.data.inventoryItem.itemId, amount: inventorySlotItem.data.inventoryItem.amount });

        await InventoryItemModel.updateOne({ slot, characterId }, { itemId, amount });

        return res.status(200).json({ success: true });
      } else {
        const allCharacterItemSlots = await axios.get<{ success: boolean, inventoryItems: InventoryItemBackend[] }>(`http://localhost:3000/api/v1/inventory-items?characterId=${characterId}`);

        const freeCharacterItemSlots = allCharacterItemSlots.data.inventoryItems.filter(i => i.itemId === 0);

        if (freeCharacterItemSlots.length === 0) {
          return res.status(500).json({ success: false, error: 'Inventory is full' })
        }

        const firstFreeSlot = freeCharacterItemSlots[0];

        updateRes = await InventoryItemModel.updateOne({ slot: firstFreeSlot.slot, characterId }, { itemId, amount });
        console.log('Update db response: ', updateRes);

        return res.status(200).json({ success: true });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
})