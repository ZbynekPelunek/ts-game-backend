import { Request, Response } from 'express-serve-static-core';

import {
  GetAttributeRequestParams,
  GetAttributeResponse,
  ListAttributesResponse
} from '../../../shared/src';
import { AttributeService } from '../services/attribute.service';

export class AttributeController {
  private attributeService: AttributeService;

  constructor() {
    this.attributeService = new AttributeService();
  }

  async list(_req: Request, res: Response<ListAttributesResponse>) {
    const attributes = await this.attributeService.list();

    res.status(200).json({
      success: true,
      attributes: attributes.map((a) => {
        return {
          attributeName: a.attributeName,
          isPercent: a.isPercent,
          label: a.label,
          desc: a.desc
        };
      })
    });
  }

  async getOneById(
    req: Request<GetAttributeRequestParams>,
    res: Response<GetAttributeResponse>
  ) {
    const { attributeId } = req.params;

    const attribute = await this.attributeService.getOneById({ attributeId });

    res.status(200).json({
      success: true,
      attribute: {
        attributeName: attribute.attributeName,
        isPercent: attribute.isPercent,
        label: attribute.label,
        desc: attribute.desc
      }
    });
  }
}
