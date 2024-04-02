import request from 'supertest';
import { describe, afterEach, it, expect, beforeAll } from '@jest/globals';

import { APP_SERVER, mockedAxios, unknownID } from '../tests/setupFile';
import { InventoryModel } from '../schema/inventory.schema';
import { PUBLIC_ROUTES } from '../server';
import { defaultMaxInventorySlots } from '../defaultCharacterData/inventory';
import {
  ArmorType,
  EquipmentSlot,
  Inventory_GET_all,
  Inventory_GET_one,
  Inventory_PATCH,
  Inventory_POST,
  InventoryActions,
  InventoryBackend,
  ItemQuality,
  ItemType,
  MainAttributeNames,
  Request_Inventory_PATCH_body,
  Request_Inventory_POST_body,
  Response_Item_GET_one
} from '../../../shared/src';
import { Common_Response_Error } from '../../../shared/src/interface/API/commonResponse';

describe('Inventory routes', () => {
  const apiAddress = PUBLIC_ROUTES.Inventory;

  afterEach(async () => {
    await InventoryModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all inventory slots', async () => {
      await addInventoryToDb({
        itemId: 1,
        amount: 2,
        characterId: unknownID,
        slot: 6
      });

      const inventoryLength = await InventoryModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_GET_all = res.body;
      expect(inventoryResponse.success).toBe(true);
      expect(inventoryResponse.inventory).toHaveLength(inventoryLength);
    });
  });

  describe(`GET ${apiAddress}/<INVENTORY_ID>`, () => {
    it('returns status code 200 with correct inventory slot', async () => {
      const inventory = await addInventoryToDb({
        itemId: 1,
        amount: 2,
        characterId: unknownID,
        slot: 6
      });
      const inventoryId = inventory.id;

      const res = await request(APP_SERVER).get(`${apiAddress}/${inventoryId}`);

      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_GET_one = res.body;
      expect(inventoryResponse.success).toBe(true);
      expect(inventoryResponse.inventory.inventoryId).toBe(inventoryId);
    });

    it('returns status code 404 when inventory ID is unknown', async () => {
      const unknownInventoryId = unknownID.toString();
      const res = await request(APP_SERVER).get(
        `${apiAddress}/${unknownInventoryId}`
      );

      expect(res.statusCode).toEqual(404);
      const inventoryResponse: Common_Response_Error = res.body;
      expect(inventoryResponse.success).toBe(false);
      expect(inventoryResponse.error).toBe(
        `Inventory with id '${unknownInventoryId}' not found`
      );
    });
  });

  describe(`POST ${apiAddress}`, () => {
    it('returns status code 201 with added inventory', async () => {
      const characterId = unknownID;
      await addInventoryToDb({
        itemId: 1,
        amount: 2,
        characterId: unknownID,
        slot: 6
      });
      const newInventory: Request_Inventory_POST_body = {
        characterId: characterId.toString(),
        slot: 5
      };

      const currentInventoryLength = await InventoryModel.countDocuments();

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send(newInventory);

      const newInventoryLength = await InventoryModel.countDocuments();

      expect(res.statusCode).toEqual(201);
      expect(newInventoryLength).toEqual(currentInventoryLength + 1);
      const inventoryResponse: Inventory_POST = res.body;
      expect(inventoryResponse.success).toEqual(true);
      expect(inventoryResponse.inventory).toHaveLength(1);
    });

    it('returns status code 201 with added new character inventory', async () => {
      const characterId = unknownID;
      await addInventoryToDb({
        itemId: 1,
        amount: 2,
        characterId: unknownID,
        slot: 6
      });
      const newInventory: Request_Inventory_POST_body = {
        characterId: characterId.toString(),
        slot: 5
      };

      const currentInventoryLength = await InventoryModel.countDocuments();

      const res = await request(APP_SERVER)
        .post(`${apiAddress}?action=${InventoryActions.NEW}`)
        .send(newInventory);

      const newInventoryLength = await InventoryModel.countDocuments();

      expect(res.statusCode).toEqual(201);
      expect(newInventoryLength).toEqual(
        currentInventoryLength + defaultMaxInventorySlots
      );
      const inventoryResponse: Inventory_POST = res.body;
      expect(inventoryResponse.success).toEqual(true);
      expect(inventoryResponse.inventory).toHaveLength(
        defaultMaxInventorySlots
      );
    });
  });

  describe(`PATCH ${apiAddress}/<INVENTORY_ID>`, () => {
    const newItemId = 5;
    const maxItemAmount = 2;

    beforeAll(() => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (
          url === `http://localhost:3000${PUBLIC_ROUTES.Items}/${newItemId}`
        ) {
          return Promise.resolve<{ data: Response_Item_GET_one }>({
            data: {
              success: true,
              item: {
                itemId: newItemId,
                itemType: ItemType.EQUIPMENT,
                name: 'Equipment1',
                quality: ItemQuality.LEGENDARY,
                attributes: [
                  {
                    attributeName: MainAttributeNames.ARMOR,
                    attributeMaxValue: 10,
                    attributeMinValue: 1,
                    requiredQuality: ItemQuality.COMMON
                  }
                ],
                equipmentType: ArmorType.LEATHER,
                itemLevel: 15,
                slot: EquipmentSlot.CHEST,
                maxAmount: maxItemAmount
              }
            }
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Promise.resolve<any>({ data: [] });
      });
    });

    it('returns status code 200 when inventory ID is the same but NOT max amount reached', async () => {
      const inventory = await addInventoryToDb({
        characterId: unknownID,
        slot: 4,
        itemId: newItemId,
        amount: 1
      });
      const inventoryId = inventory.id;

      const newInventory: Request_Inventory_PATCH_body = {
        itemId: inventory.itemId,
        amount: 1
      };
      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${inventoryId}`)
        .send(newInventory);

      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_PATCH = res.body;
      expect(inventoryResponse.success).toEqual(true);
      expect(inventoryResponse.inventory.itemId).toBe(newItemId);
      expect(inventoryResponse.inventory.amount).toBe(
        inventory.amount! + newInventory.amount!
      );
    });

    it('returns status code 400 when inventory ID is the same but max amount reached', async () => {
      const inventory = await addInventoryToDb({
        characterId: unknownID,
        slot: 4,
        itemId: newItemId,
        amount: 1
      });
      const inventoryId = inventory.id;

      const newInventory: Request_Inventory_PATCH_body = {
        itemId: inventory.itemId,
        amount: 2
      };
      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${inventoryId}`)
        .send(newInventory);

      expect(res.statusCode).toEqual(400);
      const inventoryResponse: Common_Response_Error = res.body;
      expect(inventoryResponse.success).toEqual(false);
      expect(inventoryResponse.error).toBe(
        `Max amount reached ${inventory.amount! + newInventory.amount!}/${maxItemAmount}`
      );
    });

    it('returns status code 200 when new item is received to specific empty slot', async () => {
      const inventory = await addInventoryToDb({
        characterId: unknownID,
        slot: 6
      });
      const inventoryId = inventory.id;

      const newInventory: Request_Inventory_PATCH_body = {
        itemId: newItemId
      };

      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${inventoryId}`)
        .send(newInventory);

      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_PATCH = res.body;
      expect(inventoryResponse.success).toEqual(true);
      expect(inventoryResponse.inventory.itemId).toBe(newItemId);
    });

    it('returns status code 200 when item is successfully switched with another', async () => {
      const currentInventorySlotItemId = 10;
      const inventorySlot_1 = await addInventoryToDb({
        characterId: unknownID,
        slot: 6,
        itemId: currentInventorySlotItemId,
        amount: 1
      });
      const inventorySlot_2 = await addInventoryToDb({
        characterId: unknownID,
        slot: 1,
        itemId: newItemId,
        amount: 1
      });
      const inventorySlot1Id = inventorySlot_1.id;
      const inventorySlot2Id = inventorySlot_2.id;

      const updatedInventory: Request_Inventory_PATCH_body = {
        itemId: inventorySlot_2.itemId,
        previousItemSlot: inventorySlot_2.slot,
        amount: inventorySlot_2.amount
      };

      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${inventorySlot1Id}`)
        .send(updatedInventory);

      const previousInventorySlot =
        await InventoryModel.findById(inventorySlot2Id);

      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_PATCH = res.body;
      expect(inventoryResponse.success).toEqual(true);
      expect(inventoryResponse.inventory.itemId).toBe(inventorySlot_2.itemId);
      expect(previousInventorySlot?.itemId).toBe(inventorySlot_1.itemId);
    });

    it('returns status code 200 when new item is received and added to inventory', async () => {
      const characterId = unknownID;
      const invSlot1ItemId = 10;
      const invSlot3ItemId = 7;
      const inventorySlot_1 = await addInventoryToDb({
        characterId,
        slot: 1,
        itemId: invSlot1ItemId,
        amount: 1
      });
      const inventorySlot_2 = await addInventoryToDb({
        characterId: unknownID,
        slot: 2
      });
      const inventorySlot_3 = await addInventoryToDb({
        characterId: unknownID,
        slot: 3,
        itemId: invSlot3ItemId,
        amount: 1
      });
      const inventorySlot1Id = inventorySlot_1.id;

      const updatedInventory: Request_Inventory_PATCH_body = {
        itemId: newItemId,
        amount: 2,
        characterId: characterId.toString()
      };

      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${inventorySlot1Id}`)
        .send(updatedInventory);

      const inventorySlot_1_Updated =
        await InventoryModel.findById(inventorySlot1Id);
      const inventorySlot_3_Updated =
        await InventoryModel.findById(inventorySlot_3);

      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_PATCH = res.body;
      expect(inventoryResponse.success).toEqual(true);
      expect(inventoryResponse.inventory.slot).toBe(inventorySlot_2.slot);
      expect(inventoryResponse.inventory.itemId).toBe(newItemId);
      expect(inventorySlot_1_Updated?.itemId).toBe(invSlot1ItemId);
      expect(inventorySlot_3_Updated?.itemId).toBe(invSlot3ItemId);
    });

    it('returns status code 500 when new item is received but inventory is full', async () => {
      const characterId = unknownID;
      const invSlot1ItemId = 10;
      const invSlot2ItemId = 15;
      const invSlot3ItemId = 7;
      const inventorySlot_1 = await addInventoryToDb({
        characterId,
        slot: 1,
        itemId: invSlot1ItemId,
        amount: 1
      });
      await addInventoryToDb({
        characterId: unknownID,
        slot: 2,
        itemId: invSlot2ItemId,
        amount: 1
      });
      await addInventoryToDb({
        characterId: unknownID,
        slot: 3,
        itemId: invSlot3ItemId,
        amount: 1
      });
      const inventorySlot1Id = inventorySlot_1.id;

      const updatedInventory: Request_Inventory_PATCH_body = {
        itemId: newItemId,
        amount: 2,
        characterId: characterId.toString()
      };

      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${inventorySlot1Id}`)
        .send(updatedInventory);

      expect(res.statusCode).toEqual(500);
      const inventoryResponse: Common_Response_Error = res.body;
      expect(inventoryResponse.success).toEqual(false);
      expect(inventoryResponse.error).toBe('Inventory is full');
    });
  });
});

async function addInventoryToDb(input: InventoryBackend) {
  const item = new InventoryModel<InventoryBackend>(input);

  return await item.save();
}
