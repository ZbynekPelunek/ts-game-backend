import request from 'supertest';
import { Types } from 'mongoose';
import { describe, afterEach, it, expect } from '@jest/globals';

import {
  CharacterEquipmentBackend,
  CharacterEquipmentFrontend,
  CharacterEquipment_GET_all,
  CharacterEquipment_POST,
  EquipmentSlot,
  UiPosition,
} from '../../../shared/src';
import { APP_SERVER, UNKNOWN_OBJECT_ID } from '../tests/setupFile';
import { PUBLIC_ROUTES } from '../server';
import { CharacterEquipmentModel } from '../models/characterEquipment.model';

describe('Character Equipment routes', () => {
  const apiAddress = PUBLIC_ROUTES.CharacterEquipment;

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
      expect(characterResponse.characterEquipment[0].equipmentId).toBe(
        addedCharacterEquipmentId
      );
      expect(characterResponse.characterEquipment[0].characterId).toBe(
        UNKNOWN_OBJECT_ID.toString()
      );
      expect(characterResponse.characterEquipment[0].itemId).toBe(0);
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
      expect(characterResponse.characterEquipment[0].equipmentId).toBe(
        addedCharacterEquipmentId_1
      );
      expect(characterResponse.characterEquipment[0].characterId).toBe(
        characterId
      );
      expect(characterResponse.characterEquipment[0].itemId).toBe(0);
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
      const characterEquipment: CharacterEquipmentFrontend[] = [
        {
          characterId: UNKNOWN_OBJECT_ID.toString(),
          equipmentId: '',
          slot: EquipmentSlot.CHEST,
          uiPosition: UiPosition.RIGHT,
        },
        {
          characterId: UNKNOWN_OBJECT_ID.toString(),
          equipmentId: '',
          slot: EquipmentSlot.ONE_HAND,
          uiPosition: UiPosition.LEFT,
        },
        {
          characterId: UNKNOWN_OBJECT_ID.toString(),
          equipmentId: '',
          slot: EquipmentSlot.SHOULDER,
          uiPosition: UiPosition.BOTTOM,
        },
      ];

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send({ characterEquipment });

      expect(res.statusCode).toEqual(201);
      const characterEquipmentResponse: CharacterEquipment_POST = res.body;
      expect(characterEquipmentResponse.success).toBe(true);
      expect(characterEquipmentResponse.characterEquipment).toHaveLength(
        characterEquipment.length
      );
    });

    it('returns status code 201 with single created character equipment', async () => {
      const characterEquipment: CharacterEquipmentFrontend = {
        characterId: UNKNOWN_OBJECT_ID.toString(),
        equipmentId: '',
        slot: EquipmentSlot.ONE_HAND,
        uiPosition: UiPosition.LEFT,
      };

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send({ characterEquipment });

      expect(res.statusCode).toEqual(201);
      const characterEquipmentResponse: CharacterEquipment_POST = res.body;
      expect(characterEquipmentResponse.success).toBe(true);
      expect(characterEquipmentResponse.characterEquipment).toHaveLength(1);
    });
  });
});

async function addCharacterEquipmentToDb(
  slot: EquipmentSlot,
  uiPosition: UiPosition,
  characterId = UNKNOWN_OBJECT_ID,
  itemId = undefined
) {
  const characterEquipment =
    new CharacterEquipmentModel<CharacterEquipmentBackend>({
      characterId,
      slot,
      uiPosition,
      itemId,
    });

  return characterEquipment.save();
}
