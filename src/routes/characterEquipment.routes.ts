import express, { Request, Response } from 'express';
import { Document } from 'mongoose';

import {
  CharacterEquipmentModel,
  CharacterEquipmentSchema
} from '../schema/characterEquipment.schema';
import {
  CharacterEquipmentFrontend,
  Request_CharacterEquipment_GET_all_query,
  Request_CharacterEquipment_POST_body,
  Response_CharacterEquipment_GET_all,
  Response_CharacterEquipment_POST
} from '../../../shared/src';

export const characterEquipmentRouter = express.Router();

characterEquipmentRouter.get(
  '',
  async (
    req: Request<{}, {}, {}, Request_CharacterEquipment_GET_all_query>,
    res: Response<Response_CharacterEquipment_GET_all>
  ) => {
    try {
      const { characterId } = req.query;

      let charEquipDbResponse;
      if (characterId) {
        charEquipDbResponse = await CharacterEquipmentModel.find({
          characterId
        });
      } else {
        charEquipDbResponse = await CharacterEquipmentModel.find();
      }

      const characterEquipment: CharacterEquipmentFrontend[] =
        charEquipDbResponse.map((ce) => {
          return transformResponse(ce);
        });

      return res.status(200).json({ success: true, characterEquipment });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  }
);

characterEquipmentRouter.post(
  '',
  async (
    req: Request<{}, {}, Request_CharacterEquipment_POST_body>,
    res: Response<Response_CharacterEquipment_POST>
  ) => {
    try {
      const { characterEquipment } = req.body;

      const characterEquipmentDbRes =
        await CharacterEquipmentModel.create(characterEquipment);

      let responseArr: CharacterEquipmentFrontend[] = [];
      if (Array.isArray(characterEquipmentDbRes)) {
        responseArr = characterEquipmentDbRes.map((ce) => {
          return transformResponse(ce);
        });
      } else {
        const charEquipmentResponse: CharacterEquipmentFrontend =
          transformResponse(characterEquipmentDbRes);
        responseArr.push(charEquipmentResponse);
      }

      return res
        .status(201)
        .json({ success: true, characterEquipment: responseArr });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error });
    }
  }
);

const transformResponse = (
  databaseResponse: CharacterEquipmentSchema & Document
): CharacterEquipmentFrontend => {
  return {
    characterId: databaseResponse.characterId.toString(),
    equipmentId: databaseResponse.id,
    itemId: databaseResponse.itemId,
    uiPosition: databaseResponse.uiPosition,
    slot: databaseResponse.slot
  };
};
