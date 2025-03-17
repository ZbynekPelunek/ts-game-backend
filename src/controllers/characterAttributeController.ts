import { NextFunction, Request, Response } from 'express-serve-static-core';

import {
  CharacterAttributeCreateBody,
  CharacterAttributeCreateBundleBody,
  ListCharacterAttributesRequestQuery,
  CreateCharacterAttributeResponse,
  CreateCharacterAttributeBundleResponse,
  ListCharacterAttributesResponse
} from '../../../shared/src';
import { errorHandler } from '../middleware/errorHandler';
import { ListCharacterAttributeQuery } from '../queries/characterAttribute/listCharacterAttribute';
import { CreateCharacterAttributeCommand } from '../commands/characterAttribute/create';
import { CreateBundleCharacterAttributeCommand } from '../commands/characterAttribute/createBundle';

export class CharacterAttributeController {
  constructor(
    private readonly queries: {
      listCharacterAttributeQuery: ListCharacterAttributeQuery;
    },
    private readonly commands: {
      createCharacterAttributeCommand: CreateCharacterAttributeCommand;
      createBundleCharacterAttributeCommand: CreateBundleCharacterAttributeCommand;
    }
  ) {}

  async list(
    req: Request<{}, {}, {}, ListCharacterAttributesRequestQuery>,
    res: Response<ListCharacterAttributesResponse>,
    _next: NextFunction
  ) {
    try {
      const { characterId, populateAttribute } = req.query;

      const characterAttributes =
        await this.queries.listCharacterAttributeQuery.execute({
          characterId,
          populateAttribute
        });

      res.status(200).json({
        success: true,
        characterAttributes
      });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async create(
    req: Request<{}, {}, CharacterAttributeCreateBody>,
    res: Response<CreateCharacterAttributeResponse>,
    _next: NextFunction
  ) {
    try {
      const { characterAttribute } = req.body;

      const characterAttributeCreated =
        await this.commands.createCharacterAttributeCommand.execute(
          characterAttribute
        );

      res
        .status(201)
        .json({ success: true, characterAttribute: characterAttributeCreated });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }

  async createBundle(
    req: Request<{}, {}, CharacterAttributeCreateBundleBody>,
    res: Response<CreateCharacterAttributeBundleResponse>,
    _next: NextFunction
  ) {
    try {
      const { characterAttributes } = req.body;

      await this.commands.createBundleCharacterAttributeCommand.execute(
        characterAttributes
      );

      res.status(201).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res, _next);
    }
  }
}
