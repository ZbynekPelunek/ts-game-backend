import { NextFunction, Request, Response } from 'express-serve-static-core';

import {
  BasicAttribute,
  BasicAttributeFrontend,
  GetAttributeRequestParams,
  ListAttributesResponse,
  GetAttributeResponse
} from '../../../shared/src';

import { AttributeDetailModel } from '../models/attribute.model';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class AttributeController {
  async list(
    _req: Request,
    res: Response<ListAttributesResponse>,
    _next: NextFunction
  ) {
    try {
      const attributes = await AttributeDetailModel.find().lean();

      const responseAttributes: BasicAttributeFrontend[] = attributes.map(
        (a) => {
          return {
            attributeId: a._id.toString(),
            attributeName: a.attributeName,
            isPercent: a.isPercent,
            label: a.label,
            desc: a.desc
          };
        }
      );

      res.status(200).json({ success: true, attributes: responseAttributes });
    } catch (error) {
      errorHandler(error, _req, res, _next);
    }
  }

  async getOneById(
    req: Request<GetAttributeRequestParams>,
    res: Response<GetAttributeResponse>,
    _next: NextFunction
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

      res.status(200).json({ success: true, attribute });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }
}
