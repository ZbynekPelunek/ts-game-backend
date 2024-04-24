import { Request, Response } from 'express';

import {
  BasicAttribute,
  BasicAttributeFrontend,
  Request_Attribute_GET_Params,
  Response_Attribute_GET_all,
  Response_Attribute_GET_one,
} from '../../../shared/src';

import { AttributeDetailModel } from '../models/attribute.model';

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
      return res
        .status(500)
        .json({ success: false, error: 'Attribute Get All Error [TBI]' });
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
        return res.status(404).json({
          success: false,
          error: `Attribute with id '${attributeId}' not found`,
        });
      }

      return res.status(200).json({ success: true, attribute });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Attribute Get One Error [TBI]' });
    }
  }
}
