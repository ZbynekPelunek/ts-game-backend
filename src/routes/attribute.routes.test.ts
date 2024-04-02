import request from 'supertest';
import { describe, afterEach, it, expect } from '@jest/globals';

import {
  AttributeName,
  Attribute_GET_all,
  Attribute_GET_one,
  BasicAttribute,
  MainAttributeNames
} from '../../../shared/src';
import { AttributeDetailModel } from '../schema/attribute.schema';
import { APP_SERVER, unknownID } from '../tests/setupFile';
import { PUBLIC_ROUTES } from '../server';
import { Common_Response_Error } from '../../../shared/src/interface/API/commonResponse';

describe('Attribute routes', () => {
  const apiAddress = PUBLIC_ROUTES.Attributes;

  afterEach(async () => {
    await AttributeDetailModel.deleteMany();
  });

  describe(`GET ${apiAddress}`, () => {
    it('returns status code 200 with all available attributes', async () => {
      for (const att in MainAttributeNames) {
        await addAttributeToDb(att as AttributeName, att.toLowerCase());
      }
      const attributesLength = await AttributeDetailModel.countDocuments();

      const res = await request(APP_SERVER).get(apiAddress);

      expect(res.statusCode).toEqual(200);
      const attributesResponse: Attribute_GET_all = res.body;
      expect(attributesResponse.success).toBe(true);
      expect(attributesResponse.attributes).toHaveLength(attributesLength);
    });
  });

  describe(`GET ${apiAddress}/<ATTRIBUTE_ID>`, () => {
    it('returns status code 200 with correct attribute', async () => {
      const attribute = await addAttributeToDb(
        MainAttributeNames.ARMOR,
        MainAttributeNames.ARMOR.toLowerCase()
      );
      const attributeId = attribute.id;

      const res = await request(APP_SERVER).get(`${apiAddress}/${attributeId}`);

      expect(res.statusCode).toEqual(200);
      const attributeResponse: Attribute_GET_one = res.body;
      expect(attributeResponse.success).toBe(true);
      expect(attributeResponse.attribute.attributeName).toBe(
        MainAttributeNames.ARMOR
      );
      expect(attributeResponse.attribute.label).toBe(
        MainAttributeNames.ARMOR.toLowerCase()
      );
      expect(attributeResponse.attribute.isPercent).toBe(false);
      expect(attributeResponse.attribute.desc).toBe('');
    });

    it('returns status code 404 when attribute ID is unknown', async () => {
      const res = await request(APP_SERVER).get(`${apiAddress}/${unknownID}`);

      expect(res.statusCode).toEqual(404);
      const attributeResponse: Common_Response_Error = res.body;
      expect(attributeResponse.success).toBe(false);
      expect(attributeResponse.error).toBe(
        `Attribute with id '${unknownID}' not found`
      );
    });

    it('returns status code 500 when attribute ID is wrong type', async () => {
      const attributeId = 123;

      const res = await request(APP_SERVER).get(`${apiAddress}/${attributeId}`);

      expect(res.statusCode).toEqual(500);
      const attributeResponse: Common_Response_Error = res.body;
      expect(attributeResponse.success).toBe(false);
    });
  });
});

async function addAttributeToDb(
  attributeName: AttributeName,
  label: string,
  isPercent = false,
  desc = ''
) {
  const attribute = new AttributeDetailModel<BasicAttribute>({
    attributeName,
    isPercent,
    label,
    desc
  });

  return await attribute.save();
}
