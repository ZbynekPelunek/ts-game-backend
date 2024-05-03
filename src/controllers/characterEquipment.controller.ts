import { Request, Response } from 'express';
import { Document } from 'mongoose';

import {
  Request_CharacterEquipment_GET_all_query,
  Response_CharacterEquipment_GET_all,
  CharacterEquipmentFrontend,
  Request_CharacterEquipment_POST_body,
  Response_CharacterEquipment_POST,
} from '../../../shared/src';
import {
  CharacterEquipmentModel,
  CharacterEquipmentSchema,
} from '../models/characterEquipment.model';
import { errorHandler } from '../middleware/errorHandler';

export class CharacterEquipmentController {
  async getAll(
    req: Request<{}, {}, {}, Request_CharacterEquipment_GET_all_query>,
    res: Response<Response_CharacterEquipment_GET_all>
  ) {
    try {
      const { characterId } = req.query;

      let charEquipDbResponse;
      if (characterId) {
        charEquipDbResponse = await CharacterEquipmentModel.find({
          characterId,
        });
      } else {
        charEquipDbResponse = await CharacterEquipmentModel.find();
      }

      const characterEquipment: CharacterEquipmentFrontend[] =
        charEquipDbResponse.map((ce) => {
          return this.transformResponse(ce);
        });

      return res.status(200).json({ success: true, characterEquipment });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async post(
    req: Request<{}, {}, Request_CharacterEquipment_POST_body>,
    res: Response<Response_CharacterEquipment_POST>
  ) {
    try {
      const { characterEquipment } = req.body;

      const characterEquipmentDbRes =
        await CharacterEquipmentModel.create(characterEquipment);

      let responseArr: CharacterEquipmentFrontend[] = [];
      if (Array.isArray(characterEquipmentDbRes)) {
        responseArr = characterEquipmentDbRes.map((ce) => {
          return this.transformResponse(ce);
        });
      } else {
        const charEquipmentResponse: CharacterEquipmentFrontend =
          this.transformResponse(characterEquipmentDbRes);
        responseArr.push(charEquipmentResponse);
      }

      return res
        .status(201)
        .json({ success: true, characterEquipment: responseArr });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  private transformResponse(
    databaseResponse: CharacterEquipmentSchema & Document
  ): CharacterEquipmentFrontend {
    return {
      characterId: databaseResponse.characterId.toString(),
      equipmentId: databaseResponse.id,
      itemId: databaseResponse.itemId,
      uiPosition: databaseResponse.uiPosition,
      slot: databaseResponse.slot,
    };
  }
}
