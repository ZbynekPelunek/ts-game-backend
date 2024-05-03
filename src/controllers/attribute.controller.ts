import { Request, Response } from 'express';

import {
  BasicAttribute,
  BasicAttributeFrontend,
  Request_Attribute_GET_Params,
  Response_Attribute_GET_all,
  Response_Attribute_GET_one,
} from '../../../shared/src';

import { AttributeDetailModel } from '../models/attribute.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class AttributeController {
  async getAll(_req: Request, res: Response<Response_Attribute_GET_all>) {
    try {
      const attributes = await AttributeDetailModel.find().lean();

      const responseAttributes: BasicAttributeFrontend[] = attributes.map(
        (a) => {
          return {
            attributeId: a._id.toString(),
            attributeName: a.attributeName,
            isPercent: a.isPercent,
            label: a.label,
            desc: a.desc,
          };
        }
      );

      return res
        .status(200)
        .json({ success: true, attributes: responseAttributes });
    } catch (error) {
      errorHandler(error, _req, res);
    }
  }

  async getOneById(
    req: Request<Request_Attribute_GET_Params>,
    res: Response<Response_Attribute_GET_one>
  ) {
    try {
      const { attributeId } = req.params;

      const attribute: BasicAttribute | null =
        await AttributeDetailModel.findById(attributeId).lean();
      if (!attribute) {
        throw new CustomError(
          `Attribute with id '${attributeId}' not found`,
          404
        );
      }

      return res.status(200).json({ success: true, attribute });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
