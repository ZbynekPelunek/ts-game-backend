import request from 'supertest';
import {
  describe,
  afterEach,
  it,
  expect,
  beforeAll,
  afterAll,
  xit,
} from '@jest/globals';

import { APP_SERVER, mockedAxios, UNKNOWN_OBJECT_ID } from '../setupFile';
import { defaultMaxInventorySlots } from '../../defaultCharacterData/inventory';
import {
  ArmorType,
  CurrencyId,
  EquipmentSlot,
  Inventory_GET_all,
  Inventory_GET_one,
  Inventory_PATCH,
  Inventory_POST,
  InventoryBackend,
  InventoryPatchActions,
  InventoryPostActions,
  ItemQuality,
  ItemType,
  MainAttributeNames,
  Request_Inventory_PATCH_body,
  Request_Inventory_POST_body,
  Response_CharacterCurrency_GET_all,
  Response_Item_GET_one,
} from '../../../../shared/src';
import { Common_Response_Error } from '../../../../shared/src/interface/API/commonResponse';
import { InventoryModel } from '../../models/inventory.model';
import { PUBLIC_ROUTES } from '../../services/api.service';

describe('Inventory routes', () => {
  const apiAddress = PUBLIC_ROUTES.Inventory;

  afterEach(async () => {
    await InventoryModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all inventory slots', async () => {
      await addInventoryToDb({
        item: { itemId: 1, amount: 2 },
        characterId: UNKNOWN_OBJECT_ID,
        slot: 6,
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
        item: { itemId: 1, amount: 2 },
        characterId: UNKNOWN_OBJECT_ID,
        slot: 6,
      });
      const inventoryId = inventory.id;

      const res = await request(APP_SERVER).get(`${apiAddress}/${inventoryId}`);

      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_GET_one = res.body;
      expect(inventoryResponse.success).toBe(true);
      expect(inventoryResponse.inventory._id).toBe(inventoryId);
    });

    it('returns status code 404 when inventory ID is unknown', async () => {
      const unknownInventoryId = UNKNOWN_OBJECT_ID.toString();
      const res = await request(APP_SERVER).get(
        `${apiAddress}/${unknownInventoryId}`
      );

      expect(res.statusCode).toEqual(404);
      const inventoryResponse: Common_Response_Error = res.body;
      expect(inventoryResponse.success).toBe(false);
      expect(inventoryResponse.error).toBe(
        `Inventory slot with id '${unknownInventoryId}' does not exist`
      );
    });
  });

  describe(`POST ${apiAddress}`, () => {
    it('returns status code 201 with added inventory', async () => {
      const characterId = UNKNOWN_OBJECT_ID;
      await addInventoryToDb({
        item: { itemId: 1, amount: 2 },
        characterId: UNKNOWN_OBJECT_ID,
        slot: 6,
      });
      const newInventory: Request_Inventory_POST_body = {
        characterId: characterId.toString(),
        slot: 5,
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
  });

  describe(`POST ${apiAddress}/${InventoryPostActions.NEW}`, () => {
    it('returns status code 201 with added new character inventory', async () => {
      const characterId = UNKNOWN_OBJECT_ID;
      await addInventoryToDb({
        item: { itemId: 1, amount: 2 },
        characterId: UNKNOWN_OBJECT_ID,
        slot: 6,
      });
      const newInventory: Request_Inventory_POST_body = {
        characterId: characterId.toString(),
        slot: 5,
      };

      const currentInventoryLength = await InventoryModel.countDocuments();

      const res = await request(APP_SERVER)
        .post(`${apiAddress}/${InventoryPostActions.NEW}`)
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
        if (url.includes(`${PUBLIC_ROUTES.Items}/${newItemId}`)) {
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
                    requiredQuality: ItemQuality.COMMON,
                  },
                ],
                equipmentType: ArmorType.LEATHER,
                itemLevel: 15,
                slot: EquipmentSlot.CHEST,
                maxAmount: maxItemAmount,
                sell: {
                  currencyId: CurrencyId.GOLD,
                  value: 10,
                },
              },
            },
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Promise.resolve<any>({ data: [] });
      });
    });

    afterAll(() => {
      mockedAxios.get.mockClear();
    });

    it('returns status code 200 when inventory ID is the same but NOT max amount reached', async () => {
      const inventory = await addInventoryToDb({
        characterId: UNKNOWN_OBJECT_ID,
        slot: 4,
        item: { itemId: newItemId, amount: 1 },
      });
      const inventoryId = inventory.id;

      const newInventory: Request_Inventory_PATCH_body = {
        item: {
          itemId: inventory.item!.itemId,
          amount: 1,
        },
      };
      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${inventoryId}`)
        .send(newInventory);

      console.log('test call response: ', res.body);
      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_PATCH = res.body;
      expect(inventoryResponse.success).toEqual(true);
      expect(inventoryResponse.inventory.item).toBeTruthy();
      expect(inventoryResponse.inventory.item?.itemId).toBe(newItemId);
      expect(inventoryResponse.inventory.item?.amount).toBe(
        inventory.item?.amount! + newInventory.item!.amount
      );
    });

    it('returns status code 400 when inventory ID is the same but max amount reached', async () => {
      const inventory = await addInventoryToDb({
        characterId: UNKNOWN_OBJECT_ID,
        slot: 4,
        item: { itemId: newItemId, amount: 1 },
      });
      const inventoryId = inventory.id;

      const newInventory: Request_Inventory_PATCH_body = {
        item: {
          itemId: inventory.item!.itemId,
          amount: 2,
        },
      };
      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${inventoryId}`)
        .send(newInventory);

      expect(res.statusCode).toEqual(400);
      const inventoryResponse: Common_Response_Error = res.body;
      expect(inventoryResponse.success).toEqual(false);
      expect(inventoryResponse.error).toBe(
        `Max amount reached ${inventory.item!.amount + newInventory.item?.amount!}/${maxItemAmount}`
      );
    });

    it('returns status code 200 when new item is received to specific empty slot', async () => {
      const inventory = await addInventoryToDb({
        characterId: UNKNOWN_OBJECT_ID,
        slot: 6,
      });
      const inventoryId = inventory.id;

      const newInventory: Request_Inventory_PATCH_body = {
        item: {
          itemId: newItemId,
          amount: 1,
        },
      };

      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${inventoryId}`)
        .send(newInventory);

      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_PATCH = res.body;
      expect(inventoryResponse.success).toEqual(true);
      expect(inventoryResponse.inventory.item).toBeTruthy();
      expect(inventoryResponse.inventory.item?.itemId).toBe(newItemId);
    });

    it('returns status code 200 when item is successfully switched with another', async () => {
      const currentInventorySlotItemId = 10;
      const inventorySlot_1 = await addInventoryToDb({
        characterId: UNKNOWN_OBJECT_ID,
        slot: 6,
        item: {
          itemId: currentInventorySlotItemId,
          amount: 1,
        },
      });
      const inventorySlot_2 = await addInventoryToDb({
        characterId: UNKNOWN_OBJECT_ID,
        slot: 1,
        item: {
          itemId: newItemId,
          amount: 1,
        },
      });
      const inventorySlot1Id = inventorySlot_1.id;
      const inventorySlot2Id = inventorySlot_2.id;

      const updatedInventory: Request_Inventory_PATCH_body = {
        item: {
          itemId: inventorySlot_2.item?.itemId!,
          previousSlot: inventorySlot_2.slot,
          amount: inventorySlot_2.item?.amount!,
        },
      };

      const res = await request(APP_SERVER)
        .patch(`${apiAddress}/${inventorySlot1Id}`)
        .send(updatedInventory);

      const previousInventorySlot =
        await InventoryModel.findById(inventorySlot2Id);

      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_PATCH = res.body;
      expect(inventoryResponse.success).toEqual(true);
      expect(inventoryResponse.inventory.item).toBeTruthy();
      expect(inventoryResponse.inventory.item?.itemId).toBe(
        inventorySlot_2.item?.itemId
      );
      expect(previousInventorySlot?.item?.itemId).toBe(
        inventorySlot_1.item?.itemId
      );
    });

    it('returns status code 200 when new item is received and added to inventory', async () => {
      const characterId = UNKNOWN_OBJECT_ID;
      const invSlot1ItemId = 10;
      const invSlot3ItemId = 7;
      const inventorySlot_1 = await addInventoryToDb({
        characterId,
        slot: 1,
        item: {
          itemId: invSlot1ItemId,
          amount: 1,
        },
      });
      const inventorySlot_2 = await addInventoryToDb({
        characterId: UNKNOWN_OBJECT_ID,
        slot: 2,
      });
      const inventorySlot_3 = await addInventoryToDb({
        characterId: UNKNOWN_OBJECT_ID,
        slot: 3,
        item: { itemId: invSlot3ItemId, amount: 1 },
      });
      const inventorySlot1Id = inventorySlot_1.id;

      const updatedInventory: Request_Inventory_PATCH_body = {
        item: {
          itemId: newItemId,
          amount: 2,
        },
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
      expect(inventoryResponse.inventory.item).toBeTruthy();
      expect(inventoryResponse.inventory.item?.itemId).toBe(newItemId);
      expect(inventorySlot_1_Updated?.item?.itemId).toBe(invSlot1ItemId);
      expect(inventorySlot_3_Updated?.item?.itemId).toBe(invSlot3ItemId);
    });

    it('returns status code 500 when new item is received but inventory is full', async () => {
      const characterId = UNKNOWN_OBJECT_ID;
      const invSlot1ItemId = 10;
      const invSlot2ItemId = 15;
      const invSlot3ItemId = 7;
      const inventorySlot_1 = await addInventoryToDb({
        characterId,
        slot: 1,
        item: {
          itemId: invSlot1ItemId,
          amount: 1,
        },
      });
      await addInventoryToDb({
        characterId: UNKNOWN_OBJECT_ID,
        slot: 2,
        item: {
          itemId: invSlot2ItemId,
          amount: 1,
        },
      });
      await addInventoryToDb({
        characterId: UNKNOWN_OBJECT_ID,
        slot: 3,
        item: { itemId: invSlot3ItemId, amount: 1 },
      });
      const inventorySlot1Id = inventorySlot_1.id;

      const updatedInventory: Request_Inventory_PATCH_body = {
        item: {
          itemId: newItemId,
          amount: 2,
        },
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

  describe(`PATCH ${apiAddress}/<INVENTORY_ID>/${InventoryPatchActions.SELL_ITEM}`, () => {
    const newItemId = 5;
    const charCurrencyId = 'abc';

    beforeAll(() => {
      mockedAxios.get.mockImplementation((url: string) => {
        switch (true) {
          case url.includes(`${PUBLIC_ROUTES.Items}/${newItemId}`):
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
                      requiredQuality: ItemQuality.COMMON,
                    },
                  ],
                  equipmentType: ArmorType.LEATHER,
                  itemLevel: 15,
                  slot: EquipmentSlot.CHEST,
                  maxAmount: 1,
                  sell: {
                    currencyId: CurrencyId.GOLD,
                    value: 10,
                  },
                },
              },
            });
          case url.includes(PUBLIC_ROUTES.CharacterCurrencies):
            return Promise.resolve<{
              data: Response_CharacterCurrency_GET_all;
            }>({
              data: {
                success: true,
                characterCurrencies: [
                  {
                    _id: charCurrencyId,
                    amount: 15,
                    characterId: '',
                    currencyId: CurrencyId.GOLD,
                  },
                ],
              },
            });
          default:
            return Promise.resolve<any>({ data: [] });
        }
      });

      mockedAxios.patch.mockImplementation((url: string) => {
        switch (true) {
          case url.includes(
            `${PUBLIC_ROUTES.CharacterCurrencies}/${charCurrencyId}`
          ):
            return Promise.resolve<{ data: { success: true } }>({
              data: { success: true },
            });
          default:
            return Promise.resolve<any>({ data: [] });
        }
      });
    });

    afterAll(() => {
      mockedAxios.get.mockClear();
    });

    it('returns status code 200 after selling an item', async () => {
      const inventorySlot = await addInventoryToDb({
        item: { itemId: newItemId, amount: 1 },
        characterId: UNKNOWN_OBJECT_ID,
        slot: 6,
      });
      const inventoryId = inventorySlot.id;

      const newInventory: Request_Inventory_PATCH_body = {
        item: {
          itemId: inventorySlot.item!.itemId,
          amount: 1,
        },
      };
      const res = await request(APP_SERVER)
        .patch(
          `${apiAddress}/${inventoryId}/${InventoryPatchActions.SELL_ITEM}`
        )
        .send(newInventory);

      expect(res.statusCode).toEqual(200);
      const inventoryResponse: Inventory_PATCH = res.body;
      expect(inventoryResponse.success).toEqual(true);
      expect(inventoryResponse.inventory.slot).toBe(inventorySlot.slot);
      expect(inventoryResponse.inventory.item).toBeNull();
    });
  });
});

async function addInventoryToDb(input: InventoryBackend | InventoryBackend[]) {
  return InventoryModel.create(input);
}
