import request from 'supertest';
import { describe, afterEach, it, expect } from '@jest/globals';

import {
  ArmorType,
  CommonItemsEquipmenParams,
  EquipmentSlot,
  ItemQuality,
  ItemType,
  Item_GET_all,
  Item_GET_one,
  MainAttributeNames
} from '../../../shared/src';
import { APP_SERVER } from '../tests/setupFile';
import { ItemModel } from '../schema/item.schema';
import { PUBLIC_ROUTES } from '../server';
import { Common_Response_Error } from '../../../shared/src/interface/API/commonResponse';

describe('Item routes', () => {
  const apiAddress = PUBLIC_ROUTES.Items;

  afterEach(async () => {
    await ItemModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all available items', async () => {
      await addItemToDb({
        itemId: 1,
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
        slot: EquipmentSlot.CHEST
      });

      const itemsLength = await ItemModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const itemsResponse: Item_GET_all = res.body;
      expect(itemsResponse.success).toBe(true);
      expect(itemsResponse.items).toHaveLength(itemsLength);
    });
  });

  describe(`GET ${apiAddress}/<ITEM_ID>`, () => {
    it('returns status code 200 with correct item', async () => {
      const itemId = 1;
      await addItemToDb({
        itemId,
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
        slot: EquipmentSlot.CHEST
      });

      const res = await request(APP_SERVER).get(`${apiAddress}/${itemId}`);

      expect(res.statusCode).toEqual(200);
      const itemResponse: Item_GET_one = res.body;
      expect(itemResponse.success).toBe(true);
      expect(itemResponse.item?.itemId).toBe(itemId);
    });

    it('returns status code 404 when item ID is unknown', async () => {
      const notExistingItemId = 5;
      const res = await request(APP_SERVER).get(
        `${apiAddress}/${notExistingItemId}`
      );

      expect(res.statusCode).toEqual(404);
      const attributeResponse: Common_Response_Error = res.body;
      expect(attributeResponse.success).toBe(false);
      expect(attributeResponse.error).toBe(
        `Item with id '${notExistingItemId}' not found`
      );
    });
  });
});

async function addItemToDb(input: CommonItemsEquipmenParams) {
  const item = new ItemModel<CommonItemsEquipmenParams>(input);

  return await item.save();
}
