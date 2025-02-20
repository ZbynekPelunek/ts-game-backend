import { Request, Response } from 'express';

import {
  Request_CharacterEquipment_GET_all_query,
  Response_CharacterEquipment_GET_all,
  CharacterEquipmentFrontend,
  Request_CharacterEquipment_POST_body,
  Response_CharacterEquipment_POST,
  CharacterEquipmentBackend,
  Request_CharacterEquipment_PATCH_param,
  ResponseCharacterEquipmentUnequip,
} from '../../../shared/src';
import { CustomError, errorHandler } from '../middleware/errorHandler';
import { ListCharacterEquipmentQuery } from '../queries/characterEquipment/listCharacterEquipment';
import { CommandHandler } from '../services/commandHandler';
import { CreateCharacterEquipment } from '../commands/characterEquipment/create';
import { CharacterEquipmentService } from '../services/characterEquipmentService';
import { ItemService } from '../services/itemService';
import { InventoryService } from '../services/inventoryService';
import { UnequipItemCommand } from '../commands/characterEquipment/unequipItem';
import { EquipItemFromInventoryCommand } from '../commands/characterEquipment/equipItemFromInventory';
import { CharacterAttributeService } from '../services/characterAttributeService';
import { CharacterCurrencyService } from '../services/characterCurrencyService';
import { SellEquipmentItemCommand } from '../commands/characterEquipment/sellEquipmentItem';

export class CharacterEquipmentController {
  private commandHandler: CommandHandler;
  private listCharacterEquipmentQuery: ListCharacterEquipmentQuery;
  private unequipItemCommand: UnequipItemCommand;
  private equipItemFromInventoryCommand: EquipItemFromInventoryCommand;
  private sellEquipmentItemCommand: SellEquipmentItemCommand;

  constructor() {
    this.commandHandler = new CommandHandler();
    const characterEquipmentService = new CharacterEquipmentService();
    const itemService = new ItemService();
    const inventoryService = new InventoryService();
    const characterAttributeService = new CharacterAttributeService();
    const characterCurrencyService = new CharacterCurrencyService();

    this.listCharacterEquipmentQuery = new ListCharacterEquipmentQuery(
      characterEquipmentService
    );
    this.unequipItemCommand = new UnequipItemCommand(
      characterEquipmentService,
      inventoryService,
      characterAttributeService,
      itemService
    );
    this.equipItemFromInventoryCommand = new EquipItemFromInventoryCommand(
      characterEquipmentService,
      inventoryService,
      itemService,
      characterAttributeService
    );
    this.sellEquipmentItemCommand = new SellEquipmentItemCommand(
      characterEquipmentService,
      characterCurrencyService,
      characterAttributeService,
      itemService
    );
  }

  async listCharacterEquipment(
    req: Request<{}, {}, {}, Request_CharacterEquipment_GET_all_query>,
    res: Response<Response_CharacterEquipment_GET_all>
  ) {
    try {
      const { characterId, itemSlot, populateItem } = req.query;

      const characterEquipment = await this.listCharacterEquipmentQuery.execute(
        {
          characterId,
          itemSlot,
          populateItem,
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

  async unequipItem(
    req: Request<Request_CharacterEquipment_PATCH_param>,
    res: Response<ResponseCharacterEquipmentUnequip>
  ) {
    try {
      const { characterEquipmentId } = req.params;

      await this.unequipItemCommand.execute(characterEquipmentId);

      return res.status(204).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async sellItem(
    req: Request<Request_CharacterEquipment_PATCH_param>,
    res: Response<ResponseCharacterEquipmentUnequip>
  ) {
    try {
      const { characterEquipmentId } = req.params;

      await this.sellEquipmentItemCommand.execute(characterEquipmentId);

      return res.status(204).json({ success: true });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  //TODO: define interfaces
  async equipItemFromInventory(req: Request, res: Response) {
    try {
      const { inventoryId } = req.body;

      await this.equipItemFromInventoryCommand.execute({
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
