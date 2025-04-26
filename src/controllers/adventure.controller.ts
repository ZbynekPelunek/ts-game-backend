import { Request, Response } from 'express-serve-static-core';

import {
  ListAdventuresRequestQuery,
  GetAdventureRequestParams,
  ListAdventuresResponse,
  GetAdventureResponse
} from '../../../shared/src';
import { AdventureService } from '../services/adventure.service';

export class AdventureController {
  private adventureService: AdventureService;

  constructor() {
    this.adventureService = new AdventureService();
  }

  async list(
    req: Request<{}, {}, {}, ListAdventuresRequestQuery>,
    res: Response<ListAdventuresResponse>
  ) {
    const { populateReward, adventureLevel, type, limit, adventureId } =
      req.query;

    const adventures = await this.adventureService.list({
      adventureLevel,
      limit,
      populateReward,
      type,
      adventureId
    });
    // console.log('Adventures All lean response: ', adventures);

    res.status(200).json({ success: true, adventures });
  }

  async getOneById(
    req: Request<GetAdventureRequestParams>,
    res: Response<GetAdventureResponse>
  ) {
    const { adventureId } = req.params;
    const { populateReward } = req.query;

    const adventure = await this.adventureService.getOneById({
      adventureId: +adventureId,
      query: { populateReward: Boolean(populateReward) }
    });
    //console.log('Adventure One lean response: ', adventure);

    res.status(200).json({ success: true, adventure });
  }
}
