import request from 'supertest';
import { Types } from 'mongoose';
import { describe, afterEach, it, expect, beforeAll } from '@jest/globals';

import {
  ArmorType,
  CharacterEquipmentBackend,
  CharacterEquipmentFrontend,
  CharacterEquipmentPatchActions,
  CharacterEquipment_GET_all,
  CharacterEquipment_PATCH,
  CharacterEquipment_POST,
  CurrencyId,
  EquipmentSlot,
  ItemQuality,
  ItemType,
  MainAttributeNames,
  Request_CharacterEquipment_PATCH_body,
  Request_CharacterEquipment_POST_body,
  Response_Item_GET_one,
  UiPosition,
} from '../../../../shared/src';
import { APP_SERVER, mockedAxios, UNKNOWN_OBJECT_ID } from '../setupFile';
import { CharacterEquipmentModel } from '../../models/characterEquipment.model';
import { PUBLIC_ROUTES } from '../../services/api.service';
import { Common_Response_Error } from '../../../../shared/src/interface/API/commonResponse';

describe('Character Equipment routes', () => {
  const apiAddress = PUBLIC_ROUTES.CharacterEquipment;
  const equipItemPath = `${apiAddress}/<CHARACTER_EQUIPMENT_ID>/${CharacterEquipmentPatchActions.EQUIP_ITEM}`;
  const unequipItemPath = `${apiAddress}/<CHARACTER_EQUIPMENT_ID>/${CharacterEquipmentPatchActions.UNEQUIP_ITEM}`;

  afterEach(async () => {
    await CharacterEquipmentModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns 200 with all character equipment', async () => {
      const equipmentSlot = EquipmentSlot.LEGS;
      const uiPosition = UiPosition.LEFT;
      const addedCharacterEquipment = await addCharacterEquipmentToDb(
        equipmentSlot,
        uiPosition
      );
      const addedCharacterEquipmentId = addedCharacterEquipment.id;
      const characterEquipmentLength =
        await CharacterEquipmentModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const characterResponse: CharacterEquipment_GET_all = res.body;
      expect(characterResponse.success).toBe(true);
      expect(characterResponse.characterEquipment).toHaveLength(
        characterEquipmentLength
      );
      expect(characterResponse.characterEquipment[0]._id).toBe(
        addedCharacterEquipmentId
      );
      expect(characterResponse.characterEquipment[0].characterId).toBe(
        UNKNOWN_OBJECT_ID.toString()
      );
      expect(characterResponse.characterEquipment[0].item).toBe(null);
      expect(characterResponse.characterEquipment[0].slot).toBe(equipmentSlot);
      expect(characterResponse.characterEquipment[0].uiPosition).toBe(
        uiPosition
      );
    });

    it('returns 200 with all character equipment for specific character', async () => {
      const characterId = UNKNOWN_OBJECT_ID.toString();
      const equipmentSlot_1 = EquipmentSlot.LEGS;
      const uiPosition_1 = UiPosition.LEFT;
      const addedCharacterEquipment_1 = await addCharacterEquipmentToDb(
        equipmentSlot_1,
        uiPosition_1
      );

      await addCharacterEquipmentToDb(
        EquipmentSlot.MAIN_HAND,
        UiPosition.BOTTOM,
        new Types.ObjectId()
      );
      const addedCharacterEquipmentId_1 = addedCharacterEquipment_1.id;
      const characterEquipmentLength =
        await CharacterEquipmentModel.countDocuments();

      const res = await request(APP_SERVER).get(
        `${apiAddress}?characterId=${characterId}`
      );

      expect(res.statusCode).toEqual(200);
      const characterResponse: CharacterEquipment_GET_all = res.body;
      expect(characterResponse.success).toBe(true);
      expect(characterResponse.characterEquipment).not.toHaveLength(
        characterEquipmentLength
      );
      expect(characterResponse.characterEquipment).toHaveLength(1);
      expect(characterResponse.characterEquipment[0]._id).toBe(
        addedCharacterEquipmentId_1
      );
      expect(characterResponse.characterEquipment[0].characterId).toBe(
        characterId
      );
      expect(characterResponse.characterEquipment[0].item).toBe(null);
      expect(characterResponse.characterEquipment[0].slot).toBe(
        equipmentSlot_1
      );
      expect(characterResponse.characterEquipment[0].uiPosition).toBe(
        uiPosition_1
      );
    });
  });

  describe(`POST ${apiAddress}`, () => {
    it('returns status code 201 with multiple created character equipment', async () => {
      const characterEquipmentRequestBody: Request_CharacterEquipment_POST_body =
        {
          characterEquipment: [
            {
              characterId: UNKNOWN_OBJECT_ID.toString(),
              slot: EquipmentSlot.CHEST,
              uiPosition: UiPosition.RIGHT,
            },
            {
              characterId: UNKNOWN_OBJECT_ID.toString(),
              slot: EquipmentSlot.ONE_HAND,
              uiPosition: UiPosition.LEFT,
            },
            {
              characterId: UNKNOWN_OBJECT_ID.toString(),
              slot: EquipmentSlot.SHOULDER,
              uiPosition: UiPosition.BOTTOM,
            },
          ],
        };

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send(characterEquipmentRequestBody);

      expect(res.statusCode).toEqual(201);
      const characterEquipmentResponse: CharacterEquipment_POST = res.body;
      expect(characterEquipmentResponse.success).toBe(true);
      const charEquip =
        characterEquipmentRequestBody.characterEquipment as CharacterEquipmentFrontend[];

      [];
      expect(characterEquipmentResponse.characterEquipment).toHaveLength(
        charEquip.length
      );
    });

    it('returns status code 201 with single created character equipment', async () => {
      const characterEquipmentRequestBody: Request_CharacterEquipment_POST_body =
        {
          characterEquipment: {
            characterId: UNKNOWN_OBJECT_ID.toString(),
            slot: EquipmentSlot.ONE_HAND,
            uiPosition: UiPosition.LEFT,
          },
        };

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send(characterEquipmentRequestBody);

      expect(res.statusCode).toEqual(201);
      const characterEquipmentResponse: CharacterEquipment_POST = res.body;
      expect(characterEquipmentResponse.success).toBe(true);
      expect(characterEquipmentResponse.characterEquipment).toHaveLength(1);
    });
  });

  describe(`PATCH ${equipItemPath}`, () => {
    const itemIdToEquip = 1;
    beforeAll(() => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes(`${PUBLIC_ROUTES.Items}/${itemIdToEquip}`)) {
          return Promise.resolve<{ data: Response_Item_GET_one }>({
            data: {
              success: true,
              item: {
                itemId: itemIdToEquip,
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
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Promise.resolve<any>({ data: [] });
      });
    });

    it('returns status code 200 after successfully equiping an item', async () => {
      const characterEquipment = await addCharacterEquipmentToDb(
        EquipmentSlot.CHEST,
        UiPosition.BOTTOM
      );
      const characterEquipmentId = characterEquipment.id;

      const requestBody: Request_CharacterEquipment_PATCH_body = {
        item: {
          itemId: itemIdToEquip,
        },
      };

      const res = await request(APP_SERVER)
        .patch(
          `${apiAddress}/${characterEquipmentId}/${CharacterEquipmentPatchActions.EQUIP_ITEM}`
        )
        .send(requestBody);

      console.log(res.body);
      expect(res.statusCode).toEqual(200);
      const characterEquipmentResponse: CharacterEquipment_PATCH = res.body;
      expect(characterEquipmentResponse.success).toBe(true);
      expect(characterEquipmentResponse.characterEquipment._id).toBe(
        characterEquipmentId
      );
      expect(characterEquipmentResponse.characterEquipment.item).not.toBeNull();
      expect(characterEquipmentResponse.characterEquipment.item?.itemId).toBe(
        itemIdToEquip
      );
    });

    it('returns status code 400 when the item equipment slot is incorrect', async () => {
      const characterEquipment = await addCharacterEquipmentToDb(
        EquipmentSlot.HANDS,
        UiPosition.BOTTOM
      );
      const characterEquipmentId = characterEquipment.id;

      const requestBody: Request_CharacterEquipment_PATCH_body = {
        item: {
          itemId: itemIdToEquip,
        },
      };

      const res = await request(APP_SERVER)
        .patch(
          `${apiAddress}/${characterEquipmentId}/${CharacterEquipmentPatchActions.EQUIP_ITEM}`
        )
        .send(requestBody);

      console.log(res.body);
      expect(res.statusCode).toEqual(400);
      const characterEquipmentResponse: Common_Response_Error = res.body;
      expect(characterEquipmentResponse.success).toBe(false);
      expect(characterEquipmentResponse.error).toBe('Wrong equipment slot');
    });
  });

  //describe(`PATCH ${unequipItemPath}`, () => {});
});

async function addCharacterEquipmentToDb(
  slot: EquipmentSlot,
  uiPosition: UiPosition,
  characterId = UNKNOWN_OBJECT_ID,
  item = null
) {
  const characterEquipment =
    new CharacterEquipmentModel<CharacterEquipmentBackend>({
      characterId,
      slot,
      uiPosition,
      item,
    });

  return characterEquipment.save();
}
