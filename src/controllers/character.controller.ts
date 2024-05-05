import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

import {
  CharacterBackend,
  CharacterEquipmentFrontend,
  CharacterFrontend,
  EquipmentSlot,
  InventoryActions,
  Request_Character_GET_all_query,
  Request_Character_GET_one_params,
  Request_Character_GET_one_query,
  Request_Character_POST_body,
  Request_CharacterAttribute_POST_body,
  Request_CharacterCurrency_POST_body,
  Request_CharacterEquipment_POST_body,
  Request_Inventory_POST_body,
  Request_Inventory_POST_query,
  Response_Attribute_GET_all,
  Response_Character_GET_All,
  Response_Character_GET_one,
  Response_Character_POST,
  Response_CharacterAttribute_POST,
  Response_CharacterCurrency_POST,
  Response_CharacterEquipment_POST,
  Response_Inventory_POST,
  UiPosition,
} from '../../../shared/src';
import { CharacterModel } from '../models/character.model';
import { generateDefaultCharacterAttributes } from '../defaultCharacterData/attributes';
import { generateCharacterCurrencies } from '../defaultCharacterData/currencies';
import { ApiService, FULL_PUBLIC_ROUTES } from '../services/api.service';
import { CustomError, errorHandler } from '../middleware/errorHandler';

export class CharacterController {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  async getAll(
    req: Request<{}, {}, {}, Request_Character_GET_all_query>,
    res: Response<Response_Character_GET_All>
  ) {
    try {
      const { accountId } = req.query;

      const query = CharacterModel.find().lean();

      if (accountId) query.where({ accountId });

      const characters = await query.exec();

      const responseCharacters: CharacterFrontend[] = characters.map(
        (character) => {
          return this.transformResponse(character);
        }
      );

      return res
        .status(200)
        .json({ success: true, characters: responseCharacters });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getOneById(
    req: Request<
      Request_Character_GET_one_params,
      {},
      {},
      Request_Character_GET_one_query
    >,
    res: Response<Response_Character_GET_one>
  ) {
    try {
      const { characterId } = req.params;

      //console.log('GET Character, characterId:', characterId);

      const character = await CharacterModel.findById(characterId);
      if (!character) {
        throw new CustomError(
          `Character with id '${characterId}' not found`,
          404
        );
      }

      //console.log('GET character db response: ', character);

      const responseCharacter: CharacterFrontend =
        this.transformResponse(character);

      return res
        .status(200)
        .json({ success: true, character: responseCharacter });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async createCharacter(
    req: Request<{}, {}, Request_Character_POST_body>,
    res: Response<Response_Character_POST>
  ) {
    try {
      const { accountId, name } = req.body;

      const character = new CharacterModel({
        accountId,
        name,
        maxInventorySlot: 20,
      });

      await Promise.all([
        this.createCharacterAttributes(character.id),
        this.createCharacterCurrencies(character.id),
        this.createCharacterEquipment(character.id),
        this.createCharacterInventory(character.id),
      ]);

      //console.log('saving character: ', character);

      await character.save();

      const responseCharacter = this.transformResponse(character);

      return res.status(201).json({
        success: true,
        character: responseCharacter,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  private async createCharacterAttributes(characterId: string): Promise<void> {
    const allAttributesResponse =
      await this.apiService.get<Response_Attribute_GET_all>(
        FULL_PUBLIC_ROUTES.Attributes
      );

    if (!allAttributesResponse.success) {
      throw new Error('Couldnt GET all attributes while creating character');
    }

    //console.log('allAttributesResponse: ', allAttributesResponse.data)

    const defaultCharacterAttributes = generateDefaultCharacterAttributes(
      allAttributesResponse.attributes,
      characterId
    );

    const characterAttributesResponse = await this.apiService.post<
      Response_CharacterAttribute_POST,
      Request_CharacterAttribute_POST_body
    >(FULL_PUBLIC_ROUTES.CharacterAttributes, {
      characterAttributes: defaultCharacterAttributes,
    });

    //console.log('characterAttributesResponse: ', characterAttributesResponse.data);
    if (!characterAttributesResponse.success) {
      console.error('Something went wrong while creating character attributes');
      throw new Error('Character attributes error');
    }
  }

  private async createCharacterCurrencies(characterId: string): Promise<void> {
    const defaultCharacterCurrencies = generateCharacterCurrencies(characterId);

    const characterCurrenciesResponse = await this.apiService.post<
      Response_CharacterCurrency_POST,
      Request_CharacterCurrency_POST_body
    >(FULL_PUBLIC_ROUTES.CharacterCurrencies, {
      characterCurrencies: defaultCharacterCurrencies,
    });

    //console.log('characterAttributesResponse: ', characterAttributesResponse.data);
    if (!characterCurrenciesResponse.success) {
      console.error('Something went wrong while creating character currencies');
      throw new Error('Character currencies error');
    }
  }

  private async createCharacterEquipment(characterId: string): Promise<void> {
    const equipmentArr: CharacterEquipmentFrontend[] = [];
    for (const e in EquipmentSlot) {
      const equipmentObj: CharacterEquipmentFrontend = {
        slot: e as EquipmentSlot,
        characterId: characterId,
        uiPosition: this.setUiPosition(e as EquipmentSlot),
        equipmentId: '',
      };
      equipmentArr.push(equipmentObj);
    }

    const characterEquipmentResponse = await this.apiService.post<
      Response_CharacterEquipment_POST,
      Request_CharacterEquipment_POST_body
    >(FULL_PUBLIC_ROUTES.CharacterEquipment, {
      characterEquipment: equipmentArr,
    });

    if (!characterEquipmentResponse.success) {
      console.error('Something went wrong while creating character equipment');
      throw new Error('Character equipment error');
    }
  }

  private async createCharacterInventory(characterId: string): Promise<void> {
    const inventoryQuery: Request_Inventory_POST_query = {
      action: InventoryActions.NEW,
    };
    const inventoryItemsResponse = await this.apiService.post<
      Response_Inventory_POST,
      Request_Inventory_POST_body
    >(
      FULL_PUBLIC_ROUTES.Inventory,
      { characterId: characterId },
      { params: inventoryQuery }
    );

    if (!inventoryItemsResponse.success) {
      throw new Error('Character inventory error');
    }
  }

  private transformResponse(
    databaseResponse: CharacterBackend
  ): CharacterFrontend {
    return {
      characterId: databaseResponse._id!.toString(),
      accountId: databaseResponse.accountId.toString(),
      adventures: databaseResponse.adventures,
      currentExperience: databaseResponse.currentExperience,
      level: databaseResponse.level,
      maxExperience: databaseResponse.maxExperience,
      name: databaseResponse.name,
    };
  }

  private setUiPosition(equipSlot: EquipmentSlot): UiPosition {
    switch (equipSlot) {
      case EquipmentSlot.CHEST:
      case EquipmentSlot.SHOULDER:
      case EquipmentSlot.HEAD:
        return UiPosition.LEFT;

      case EquipmentSlot.HANDS:
      case EquipmentSlot.LEGS:
        return UiPosition.RIGHT;

      case EquipmentSlot.MAIN_HAND:
      case EquipmentSlot.OFF_HAND:
        return UiPosition.BOTTOM;
      default:
        return UiPosition.LEFT;
    }
  }
}
