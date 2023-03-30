import express, { Request, Response } from 'express';

import { AttributeModel } from '../schema/attribute.schema';

export const attributesRouter = express.Router();

attributesRouter.get('', async (_req: Request, res: Response) => {
  try {

    const attributes = await AttributeModel.find();

    return res.status(200).json({ success: true, attributes });

  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
})

attributesRouter.get('/:attributeId', async (req: Request, res: Response) => {
  try {
    const { attributeId } = req.params;


    const attribute = await AttributeModel.findOne({ 'internal-name': attributeId });
    if (!attribute) {
      return res.status(404).json({ success: false, error: `Attribute with id '${attributeId}' not found` });
    }

    return res.status(200).json({ success: true, attribute });

  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
})