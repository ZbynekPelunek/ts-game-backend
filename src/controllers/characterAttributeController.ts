import { Request, Response } from 'express';

import {
  CharacterAttributeCreateBody,
  CharacterAttributeCreateBundleBody,
  CharacterAttributeListQueryParams,
  ResponseCharacterAttributeCreate,
  ResponseCharacterAttributeCreateBundle,
  ResponseCharacterAttributeList,
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
    req: Request<{}, {}, {}, CharacterAttributeListQueryParams>,
    res: Response<ResponseCharacterAttributeList>
  ) {
    try {
      const { characterId, populateAttribute } = req.query;

      const characterAttributes =
        await this.queries.listCharacterAttributeQuery.execute({
          characterId,
          populateAttribute,
        });

      return res.status(200).json({
        success: true,
        characterAttributes,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async create(
    req: Request<{}, {}, CharacterAttributeCreateBody>,
    res: Response<ResponseCharacterAttributeCreate>
  ) {
    try {
      const { characterAttribute } = req.body;

      const characterAttributeCreated =
        await this.commands.createCharacterAttributeCommand.execute(
          characterAttribute
        );

      return res
        .status(201)
        .json({ success: true, characterAttribute: characterAttributeCreated });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async createBundle(
    req: Request<{}, {}, CharacterAttributeCreateBundleBody>,
    res: Response<ResponseCharacterAttributeCreateBundle>
  ) {
    try {
      const { characterAttributes } = req.body;

      await this.commands.createBundleCharacterAttributeCommand.execute(
        characterAttributes
      );

      return res.status(201).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
