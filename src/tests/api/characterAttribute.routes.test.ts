import request from 'supertest';
import { describe, afterEach, it, expect, xit } from '@jest/globals';

import {
  BasicAttribute,
  CharacterAttributeBackend,
  CharacterAttributeFrontend,
  CharacterAttribute_GET_all,
  CharacterAttribute_POST,
  MainAttributeNames
} from '../../../../shared/src';
import { APP_SERVER, UNKNOWN_OBJECT_ID } from '../setupFile';
import { AttributeModel } from '../../models/attribute.model';
import { CharacterAttributeModel } from '../../models/characterAttribute.model';
import { PUBLIC_ROUTES } from '../../services/apiService';

describe('Character Attribute routes', () => {
  const apiAddress = PUBLIC_ROUTES.CharacterAttributes;
  const commonCharAttributesValues: CharacterAttributeFrontend = {
    baseValue: 0,
    equipmentAddedValue: 0,
    otherAttributesAddedValue: 0,
    totalValue: 0,
    attributeId: UNKNOWN_OBJECT_ID.toString(),
    characterId: UNKNOWN_OBJECT_ID.toString(),
    characterAttributeId: UNKNOWN_OBJECT_ID.toString()
  };

  afterEach(async () => {
    await CharacterAttributeModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all available attributes', async () => {
      await addCharacterAttributeToDb();

      const charAttributesLength =
        await CharacterAttributeModel.countDocuments();

      const res = await request(APP_SERVER).get(`${apiAddress}`);

      expect(res.statusCode).toEqual(200);
      const characterAttributesResponse: CharacterAttribute_GET_all = res.body;
      expect(characterAttributesResponse.success).toBe(true);
      expect(characterAttributesResponse.characterAttributes).toHaveLength(
        charAttributesLength
      );
    });

    it('returns status code 200 with all available attributes for specific character', async () => {
      const characterId = UNKNOWN_OBJECT_ID;
      await addCharacterAttributeToDb(characterId);

      const charAttributesLength =
        await CharacterAttributeModel.countDocuments();

      const res = await request(APP_SERVER).get(
        `${apiAddress}?characterId=${characterId}`
      );

      expect(res.statusCode).toEqual(200);
      const characterAttributesResponse: CharacterAttribute_GET_all = res.body;
      expect(characterAttributesResponse.success).toBe(true);
      expect(characterAttributesResponse.characterAttributes).toHaveLength(
        charAttributesLength
      );
    });

    it('returns status code 200 with all available attributes for specific character and populates Attribute details', async () => {
      const characterId = UNKNOWN_OBJECT_ID;
      const attributeName = MainAttributeNames.HEALTH;
      const attributeLabel = attributeName.toLowerCase();
      const attribute = new AttributeModel<BasicAttribute>({
        attributeName,
        isPercent: false,
        label: attributeLabel,
        desc: ''
      });

      await attribute.save();
      const attributeId = attribute._id;

      await addCharacterAttributeToDb(characterId, attributeId);

      const charAttributesLength =
        await CharacterAttributeModel.countDocuments();

      const res = await request(APP_SERVER).get(
        `${apiAddress}?characterId=${characterId}&populateAttribute=true`
      );

      expect(res.statusCode).toEqual(200);
      const characterAttributesResponse: CharacterAttribute_GET_all = res.body;
      expect(characterAttributesResponse.success).toBe(true);
      expect(characterAttributesResponse.characterAttributes).toHaveLength(
        charAttributesLength
      );
      expect(
        characterAttributesResponse.characterAttributes[0].attribute
          ?.attributeName
      ).toBe(attributeName);
      expect(
        characterAttributesResponse.characterAttributes[0].attribute?.label
      ).toBe(attributeLabel);
      expect(
        characterAttributesResponse.characterAttributes[0].attribute?.isPercent
      ).toBe(false);
      expect(
        characterAttributesResponse.characterAttributes[0].attribute?.desc
      ).toBe('');
      await AttributeModel.deleteMany();
    });
  });

  describe(`POST ${apiAddress}`, () => {
    it('returns status code 201 with multiple created character attributes', async () => {
      const characterAttributes: CharacterAttributeFrontend[] = [
        {
          ...commonCharAttributesValues,
          totalValue: 1
        },
        {
          ...commonCharAttributesValues,
          equipmentAddedValue: 5
        },
        {
          ...commonCharAttributesValues,
          baseValue: 10
        }
      ];

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send({ characterAttributes });

      expect(res.statusCode).toEqual(201);
      const characterAttributesResponse: CharacterAttribute_POST = res.body;
      expect(characterAttributesResponse.success).toBe(true);
      expect(characterAttributesResponse.characterAttributes).toHaveLength(
        characterAttributes.length
      );
    });

    it('returns status code 201 with single created character attribute', async () => {
      const charAttTotalValue = 15;
      const characterAttributes: CharacterAttributeFrontend = {
        ...commonCharAttributesValues,
        totalValue: charAttTotalValue
      };

      const res = await request(APP_SERVER)
        .post(`${apiAddress}`)
        .send({ characterAttributes });

      expect(res.statusCode).toEqual(201);
      const characterAttributesResponse: CharacterAttribute_POST = res.body;
      expect(characterAttributesResponse.success).toBe(true);
      expect(characterAttributesResponse.characterAttributes).toHaveLength(1);
      expect(
        characterAttributesResponse.characterAttributes[0].totalValue
      ).toBe(charAttTotalValue);
    });
  });
});

async function addCharacterAttributeToDb(
  characterId = UNKNOWN_OBJECT_ID,
  attributeId = UNKNOWN_OBJECT_ID,
  baseValue = 0,
  addedValue = 0,
  statsAddedValue = 0,
  totalValue = 0
) {
  const charAttribute = new CharacterAttributeModel<CharacterAttributeBackend>({
    characterId,
    attributeId,
    baseValue,
    equipmentAddedValue: addedValue,
    otherAttributesAddedValue: statsAddedValue,
    totalValue
  });

  return charAttribute.save();
}
