import express, { Request, Response } from 'express';

import { BasicAttribute, Response_Attributes_GET_all, Response_Attributes_GET_one } from '../../../shared/src';
import { Request_Attributes_GET_Params } from '../../../shared/src/interface/api-request/attributes';
import { AttributeModel } from '../schema/attribute.schema';

export const attributesRouter = express.Router();

attributesRouter.get('', async (_req, res: Response<Response_Attributes_GET_all>) => {
  try {
    const attributes: BasicAttribute[] = await AttributeModel.find();

    return res.status(200).json({ success: true, attributes });

  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
})

attributesRouter.get('/:attributeId', async (req: Request<Request_Attributes_GET_Params>, res: Response<Response_Attributes_GET_one>) => {
  try {
    const { attributeId } = req.params;

    const attribute: BasicAttribute | null = await AttributeModel.findOne({ 'internal-name': attributeId });
    if (!attribute) {
      return res.status(404).json({ success: false, error: `Attribute with id '${attributeId}' not found` });
    }

    return res.status(200).json({ success: true, attribute });

  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
})