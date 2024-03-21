import request from 'supertest';
import { Document } from 'mongoose';

import { APP_SERVER, mockedAxios, unknownID } from '../tests/setupFile';
import { Common_Response_Error } from '../../../shared/src/interface/api-response/common';
import { InventoryItemModel, InventoryItemSchema } from '../schema/inventoryItem.schema';
import { ArmorType, EquipmentSlot, InventoryItemBackend, InventoryItemFrontend, InventoryItems_GET_all, InventoryItems_GET_one, InventoryItems_PATCH, InventoryItems_POST, ItemQuality, ItemType, MainAttributeNames, Request_Inventories_PATCH_body, Request_Inventories_POST_body, Response_Items_GET_one } from '../../../shared/src';
import { PUBLIC_ROUTES } from '../server';
import { InventoryActions } from './inventoryItem.routes';
import { defaultMaxInventorySlots } from '../defaultCharacterData/inventory';

describe('Inventory routes', () => {
  const apiAddress = PUBLIC_ROUTES.Inventory;

  afterEach(async () => {
    await InventoryItemModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all available inventory items', async () => {
      await addInventoryItemToDb({
        itemId: 1,
        amount: 2,
        characterId: unknownID,
        slot: 6
      });

      const itemsLength = await InventoryItemModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const itemsResponse: InventoryItems_GET_all = res.body;
      expect(itemsResponse.success).toBe(true);
      expect(itemsResponse.inventoryItems).toHaveLength(itemsLength);
    });
  })

  describe(`GET ${apiAddress}/<INVENTORY_ITEM_ID>`, () => {
    it('returns status code 200 with correct inventory item', async () => {
      const invItem = await addInventoryItemToDb({
        itemId: 1,
        amount: 2,
        characterId: unknownID,
        slot: 6
      });
      const invItemId = invItem.id;

      const res = await request(APP_SERVER).get(`${apiAddress}/${invItemId}`);

      expect(res.statusCode).toEqual(200);
      const itemResponse: InventoryItems_GET_one = res.body;
      expect(itemResponse.success).toBe(true);
      expect(itemResponse.inventoryItem.inventoryItemId).toBe(invItemId);
    });

    it('returns status code 404 when inventory item ID is unknown', async () => {
      const unknownInventoryItemId = unknownID.toString();
      const res = await request(APP_SERVER).get(`${apiAddress}/${unknownInventoryItemId}`);

      expect(res.statusCode).toEqual(404);
      const attributeResponse: Common_Response_Error = res.body;
      expect(attributeResponse.success).toBe(false);
      expect(attributeResponse.error).toBe(`Inventory item with id '${unknownInventoryItemId}' not found`);
    });
  });

  describe(`POST ${apiAddress}`, () => {
    it('returns status code 201 with added inventory item', async () => {
      const characterId = unknownID;
      await addInventoryItemToDb({
        itemId: 1,
        amount: 2,
        characterId: unknownID,
        slot: 6
      });
      const newInventoryItem: Request_Inventories_POST_body = {
        characterId: characterId.toString(),
        slot: 5
      }

      const currentInventoryItemsLength = await InventoryItemModel.countDocuments();

      const res = await request(APP_SERVER).post(`${apiAddress}`).send(newInventoryItem);

      const newInventoryItemsLength = await InventoryItemModel.countDocuments();

      expect(res.statusCode).toEqual(201);
      expect(newInventoryItemsLength).toEqual(currentInventoryItemsLength + 1);
      const inventoryItemsResponse: InventoryItems_POST = res.body;
      expect(inventoryItemsResponse.success).toEqual(true);
      expect(inventoryItemsResponse.inventoryItems).toHaveLength(1);
    })

    it('returns status code 201 with added new character inventory', async () => {
      const characterId = unknownID;
      await addInventoryItemToDb({
        itemId: 1,
        amount: 2,
        characterId: unknownID,
        slot: 6
      });
      const newInventoryItem: Request_Inventories_POST_body = {
        characterId: characterId.toString(),
        slot: 5
      }

      const currentInventoryItemsLength = await InventoryItemModel.countDocuments();

      const res = await request(APP_SERVER).post(`${apiAddress}?action=${InventoryActions.NEW}`).send(newInventoryItem);

      const newInventoryItemsLength = await InventoryItemModel.countDocuments();

      expect(res.statusCode).toEqual(201);
      expect(newInventoryItemsLength).toEqual(currentInventoryItemsLength + defaultMaxInventorySlots);
      const inventoryItemsResponse: InventoryItems_POST = res.body;
      expect(inventoryItemsResponse.success).toEqual(true);
      expect(inventoryItemsResponse.inventoryItems).toHaveLength(defaultMaxInventorySlots);
    })
  })

  describe(`PATCH ${apiAddress}/<INVENTORY_ITEM_ID>`, () => {
    let newItemId = 5;
    let maxItemAmount = 2;

    beforeAll(() => {
      mockedAxios.get.mockImplementation((url) => {
        if (url === `http://localhost:3000${PUBLIC_ROUTES.Items}/${newItemId}`) {
          return Promise.resolve<{ data: Response_Items_GET_one }>(
            {
              data:
              {
                success: true, item: {
                  itemId: newItemId,
                  itemType: ItemType.EQUIPMENT,
                  name: 'Equipment1',
                  quality: ItemQuality.LEGENDARY,
                  attributes: [{ attributeName: MainAttributeNames.ARMOR, attributeMaxValue: 10, attributeMinValue: 1, requiredQuality: ItemQuality.COMMON }],
                  equipmentType: ArmorType.LEATHER,
                  itemLevel: 15,
                  slot: EquipmentSlot.CHEST,
                  maxAmount: maxItemAmount
                }
              }
            }
          )
        }
        return Promise.resolve({ data: [] })
      });
    })

    it('returns status code 200 when item ID is the same but NOT max amount reached', async () => {
      const inventoryItem = await addInventoryItemToDb({
        characterId: unknownID,
        slot: 4,
        itemId: newItemId,
        amount: 1
      });
      const inventoryItemId = inventoryItem.id;

      const newInventoryItem: Request_Inventories_PATCH_body = {
        itemId: inventoryItem.itemId,
        amount: 1
      }
      const res = await request(APP_SERVER).patch(`${apiAddress}/${inventoryItemId}`).send(newInventoryItem);

      expect(res.statusCode).toEqual(200);
      const inventoryItemResponse: InventoryItems_PATCH = res.body;
      expect(inventoryItemResponse.success).toEqual(true);
      expect(inventoryItemResponse.inventoryItem.itemId).toBe(newItemId);
      expect(inventoryItemResponse.inventoryItem.amount).toBe(inventoryItem.amount! + newInventoryItem.amount!);
    })

    it('returns status code 400 when item ID is the same but max amount reached', async () => {
      const inventoryItem = await addInventoryItemToDb({
        characterId: unknownID,
        slot: 4,
        itemId: newItemId,
        amount: 1
      });
      const inventoryItemId = inventoryItem.id;

      const newInventoryItem: Request_Inventories_PATCH_body = {
        itemId: inventoryItem.itemId,
        amount: 2
      }
      const res = await request(APP_SERVER).patch(`${apiAddress}/${inventoryItemId}`).send(newInventoryItem);

      expect(res.statusCode).toEqual(400);
      const inventoryItemResponse: Common_Response_Error = res.body;
      expect(inventoryItemResponse.success).toEqual(false);
      expect(inventoryItemResponse.error).toBe(`Max amount reached ${inventoryItem.amount! + newInventoryItem.amount!}/${maxItemAmount}`);
    })

    it('returns status code 200 when new item is received to specific empty slot', async () => {
      const inventoryItem = await addInventoryItemToDb({
        characterId: unknownID,
        slot: 6
      });
      const inventoryItemId = inventoryItem.id;

      const newInventoryItem: Request_Inventories_PATCH_body = {
        itemId: newItemId
      }

      const res = await request(APP_SERVER).patch(`${apiAddress}/${inventoryItemId}`).send(newInventoryItem);

      expect(res.statusCode).toEqual(200);
      const inventoryItemResponse: InventoryItems_PATCH = res.body;
      expect(inventoryItemResponse.success).toEqual(true);
      expect(inventoryItemResponse.inventoryItem.itemId).toBe(newItemId);
    })

    it('returns status code 200 when item is successfully switched with another', async () => {
      const currentInventorySlotItemId = 10;
      const inventoryItemSlot_1 = await addInventoryItemToDb({
        characterId: unknownID,
        slot: 6,
        itemId: currentInventorySlotItemId,
        amount: 1
      });
      const inventoryItemSlot_2 = await addInventoryItemToDb({
        characterId: unknownID,
        slot: 1,
        itemId: newItemId,
        amount: 1
      });
      const inventoryItemSlot1Id = inventoryItemSlot_1.id;
      const inventoryItemSlot2Id = inventoryItemSlot_2.id;

      const updatedInventoryItem: Request_Inventories_PATCH_body = {
        itemId: inventoryItemSlot_2.itemId,
        previousItemSlot: inventoryItemSlot_2.slot,
        amount: inventoryItemSlot_2.amount
      }

      const res = await request(APP_SERVER).patch(`${apiAddress}/${inventoryItemSlot1Id}`).send(updatedInventoryItem);

      const previousInventorySlot = await InventoryItemModel.findById(inventoryItemSlot2Id);

      expect(res.statusCode).toEqual(200);
      const inventoryItemResponse: InventoryItems_PATCH = res.body;
      expect(inventoryItemResponse.success).toEqual(true);
      expect(inventoryItemResponse.inventoryItem.itemId).toBe(inventoryItemSlot_2.itemId);
      expect(previousInventorySlot?.itemId).toBe(inventoryItemSlot_1.itemId);
    })

    it('returns status code 200 when new item is received and added to inventory', async () => {
      const characterId = unknownID;
      const invSlot1ItemId = 10;
      const invSlot3ItemId = 7;
      const inventoryItemSlot_1 = await addInventoryItemToDb({
        characterId,
        slot: 1,
        itemId: invSlot1ItemId,
        amount: 1
      });
      const inventoryItemSlot_2 = await addInventoryItemToDb({
        characterId: unknownID,
        slot: 2,
      });
      const inventoryItemSlot_3 = await addInventoryItemToDb({
        characterId: unknownID,
        slot: 3,
        itemId: invSlot3ItemId,
        amount: 1
      });
      const inventoryItemSlot1Id = inventoryItemSlot_1.id;

      const updatedInventoryItem: Request_Inventories_PATCH_body = {
        itemId: newItemId,
        amount: 2,
        characterId: characterId.toString()
      }

      const res = await request(APP_SERVER).patch(`${apiAddress}/${inventoryItemSlot1Id}`).send(updatedInventoryItem);

      const inventoryItemSlot_1_AfterRequest = await InventoryItemModel.findById(inventoryItemSlot1Id);
      const inventoryItemSlot_3_AfterRequest = await InventoryItemModel.findById(inventoryItemSlot_3);

      console.log('Response: ', res.body)
      expect(res.statusCode).toEqual(200);
      const inventoryItemResponse: InventoryItems_PATCH = res.body;
      expect(inventoryItemResponse.success).toEqual(true);
      expect(inventoryItemResponse.inventoryItem.slot).toBe(inventoryItemSlot_2.slot);
      expect(inventoryItemResponse.inventoryItem.itemId).toBe(newItemId);
      expect(inventoryItemSlot_1_AfterRequest?.itemId).toBe(invSlot1ItemId);
      expect(inventoryItemSlot_3_AfterRequest?.itemId).toBe(invSlot3ItemId);
    })
  })
})

async function addInventoryItemToDb(input: InventoryItemBackend): Promise<InventoryItemSchema & Document> {
  const item = new InventoryItemModel<InventoryItemBackend>(input);

  return await item.save();
}