import express, { Request, Response } from 'express';

import {
  BasicAttribute,
  BasicAttributeFrontend,
  Response_Attributes_GET_all,
  Response_Attributes_GET_one,
} from '../../../shared/src';
import {
  Request_Attributes_GET_Params,
} from '../../../shared/src/interface/api-request/attributes';
import { AttributeDetailModel } from '../schema/attribute.schema';

export const attributesRouter = express.Router();

attributesRouter.get('', async (_req, res: Response<Response_Attributes_GET_all>) => {
  try {
    const attributes = await AttributeDetailModel.find();

    const responseAttributes: BasicAttributeFrontend[] = attributes.map(a => {
      return {
        attributeId: a._id.toString(),
        attributeName: a.attributeName,
        isPercent: a.isPercent,
        label: a.label,
        desc: a.desc
      }
    });

    return res.status(200).json({ success: true, attributes: responseAttributes });

  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
})

attributesRouter.get('/:attributeId', async (req: Request<Request_Attributes_GET_Params>, res: Response<Response_Attributes_GET_one>) => {
  try {
    const { attributeId } = req.params;

    const attribute: BasicAttribute | null = await AttributeDetailModel.findOne({ 'internal-name': attributeId });
    if (!attribute) {
      return res.status(404).json({ success: false, error: `Attribute with id '${attributeId}' not found` });
    }

    return res.status(200).json({ success: true, attribute });

  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
})