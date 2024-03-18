import request from 'supertest';

import { APP_SERVER, unknownID } from '../tests/setupFile';
import { Common_Response_Error } from '../../../shared/src/interface/api-response/common';
import { InventoryItemModel } from '../schema/inventoryItem.schema';
import { InventoryItemBackend, InventoryItems_GET_all, InventoryItems_GET_one } from '../../../shared/src';
import { PUBLIC_ROUTES } from '../server';

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

  describe(`GET ${apiAddress}/<ITEM_ID>`, () => {
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
  })
})

async function addInventoryItemToDb(input: InventoryItemBackend) {
  const item = new InventoryItemModel<InventoryItemBackend>(input);

  return await item.save();
}