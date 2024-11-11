import { Request, Response } from 'express';

import {
  Request_CharacterEquipment_GET_all_query,
  Response_CharacterEquipment_GET_all,
  CharacterEquipmentFrontend,
  Request_CharacterEquipment_POST_body,
  Response_CharacterEquipment_POST,
  CharacterEquipmentBackend,
  Request_CharacterEquipment_PATCH_param,
  Request_CharacterEquipment_PATCH_body,
  Response_CharacterEquipment_PATCH,
} from '../../../shared/src';
import { CustomError, errorHandler } from '../middleware/errorHandler';
import { ListCharacterEquipmentQuery } from '../queries/characterEquipment/listCharacterEquipment';
import { CommandHandler } from '../services/commandHandler';
import { CreateCharacterEquipment } from '../commands/characterEquipment/createCharacterEquipment';
import { EquipItemCommand } from '../commands/characterEquipment/equipItem';
import { CharacterEquipmentService } from '../services/characterEquipmentService';
import { ItemService } from '../services/itemService';
import { InventoryService } from '../services/inventoryService';
import { UnequipItemCommand } from '../commands/characterEquipment/unequipItem';
import { EquipItemFromInventoryCommand } from '../commands/characterEquipment/equipItemFromInventory';

export class CharacterEquipmentController {
  private commandHandler: CommandHandler;
  private listCharacterEquipmentQuery: ListCharacterEquipmentQuery;
  private equipItemCommand: EquipItemCommand;
  private unequipItemCommand: UnequipItemCommand;
  private equipItemFromInventoryCommand: EquipItemFromInventoryCommand;

  constructor() {
    this.commandHandler = new CommandHandler();
    const characterEquipmentService = new CharacterEquipmentService();
    const itemService = new ItemService();
    const inventoryService = new InventoryService();
    this.listCharacterEquipmentQuery = new ListCharacterEquipmentQuery(
      characterEquipmentService
    );
    this.equipItemCommand = new EquipItemCommand(
      characterEquipmentService,
      itemService,
      inventoryService
    );
    this.unequipItemCommand = new UnequipItemCommand(
      characterEquipmentService,
      inventoryService
    );
    this.equipItemFromInventoryCommand = new EquipItemFromInventoryCommand(
      characterEquipmentService,
      inventoryService,
      itemService
    );
  }

  async listCharacterEquipment(
    req: Request<{}, {}, {}, Request_CharacterEquipment_GET_all_query>,
    res: Response<Response_CharacterEquipment_GET_all>
  ) {
    try {
      const { characterId, itemSlot } = req.query;

      const characterEquipment = await this.listCharacterEquipmentQuery.execute(
        {
          characterId,
          itemSlot,
        }
      );

      return res.status(200).json({ success: true, characterEquipment });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async createCharacterEquipment(
    req: Request<{}, {}, Request_CharacterEquipment_POST_body>,
    res: Response<Response_CharacterEquipment_POST>
  ) {
    try {
      const command = new CreateCharacterEquipment(req.body);

      const characterEquipmentDbRes = await this.commandHandler.handle(command);

      if (!characterEquipmentDbRes) {
        throw new CustomError(
          'Something went wrong while creating character equipment',
          500
        );
      }

      let responseArr: CharacterEquipmentFrontend[] = [];
      if (Array.isArray(characterEquipmentDbRes)) {
        responseArr = this.transformResponseArray(characterEquipmentDbRes);
      } else {
        const charEquipmentResponse: CharacterEquipmentFrontend =
          this.transformResponseObject(characterEquipmentDbRes);
        responseArr.push(charEquipmentResponse);
      }

      return res
        .status(201)
        .json({ success: true, characterEquipment: responseArr });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async equipItem(
    req: Request<
      Request_CharacterEquipment_PATCH_param,
      {},
      Request_CharacterEquipment_PATCH_body
    >,
    res: Response<Response_CharacterEquipment_PATCH>
  ) {
    try {
      const { characterEquipmentId } = req.params;
      const { itemId } = req.body;

      const characterEquipment = await this.equipItemCommand.execute(
        characterEquipmentId,
        itemId
      );

      return res.status(200).json({ success: true, characterEquipment });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async unequipItem(
    req: Request<
      Request_CharacterEquipment_PATCH_param,
      {},
      Request_CharacterEquipment_PATCH_body
    >,
    res: Response<Response_CharacterEquipment_PATCH>
  ) {
    try {
      const { characterEquipmentId } = req.params;
      const { itemId } = req.body;

      const characterEquipment = await this.unequipItemCommand.execute(
        characterEquipmentId,
        itemId
      );

      return res.status(200).json({ success: true, characterEquipment });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  //TODO: define interfaces
  async equipItemFromInventory(req: Request, res: Response) {
    try {
      const { itemId, characterId, inventoryId } = req.body;

      await this.equipItemFromInventoryCommand.execute({
        itemId,
        characterId,
        inventoryId,
      });

      return res.status(204).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  private transformResponseObject(
    databaseResponse: CharacterEquipmentBackend
  ): CharacterEquipmentFrontend {
    return {
      characterId: databaseResponse.characterId.toString(),
      _id: databaseResponse._id!.toString(),
      itemId: databaseResponse.itemId,
      uiPosition: databaseResponse.uiPosition,
      slot: databaseResponse.slot,
    };
  }

  private transformResponseArray(
    databaseResponse: CharacterEquipmentBackend[]
  ): CharacterEquipmentFrontend[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }
}
