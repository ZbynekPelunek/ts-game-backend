import { Request, Response } from 'express';

import {
  CharacterAttributeCreateBody,
  CharacterAttributeCreateBundleBody,
  CharacterBackend,
  CharacterEquipmentFrontend,
  CharacterFrontend,
  EquipmentSlot,
  InventoryPostActions,
  Request_Character_GET_all_query,
  Request_Character_GET_one_params,
  Request_Character_GET_one_query,
  Request_Character_POST_body,
  Request_CharacterCurrency_POST_body,
  Request_CharacterEquipment_POST_body,
  Request_Inventory_POST_body,
  Response_Attribute_GET_all,
  Response_Character_GET_All,
  Response_Character_GET_one,
  Response_Character_POST,
  Response_CharacterCurrency_POST,
  Response_CharacterEquipment_POST,
  Response_Inventory_POST,
  ResponseCharacterAttributeCreate,
  ResponseCharacterAttributeCreateBundle,
  UiPosition,
} from '../../../shared/src';
import { CharacterModel } from '../models/character.model';
import { generateDefaultCharacterAttributes } from '../defaultCharacterData/attributes';
import { generateCharacterCurrencies } from '../defaultCharacterData/currencies';
import { ApiService, PUBLIC_ROUTES } from '../services/apiService';
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

      const character = await CharacterModel.findById(characterId);
      if (!character) {
        throw new CustomError(
          `Character with id '${characterId}' not found`,
          404
        );
      }

      const responseCharacter: CharacterFrontend =
        this.transformResponse(character);

      return res
        .status(200)
        .json({ success: true, character: responseCharacter });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  //TODO add interface
  async patch(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      const updateFields = req.body;

      const updatedCharacter = await CharacterModel.findByIdAndUpdate(
        characterId,
        updateFields,
        { new: true, runValidators: true }
      );
      if (!updatedCharacter) {
        throw new CustomError(
          `Character with id '${characterId}' not found`,
          404
        );
      }

      const responseCharacter: CharacterFrontend =
        this.transformResponse(updatedCharacter);

      return res
        .status(200)
        .json({ success: true, character: responseCharacter });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  //TODO add interface
  async increaseExperience(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      const { experience } = req.body;

      const character = await CharacterModel.findById(characterId);
      if (!character) {
        throw new CustomError(
          `Character with id '${characterId}' not found`,
          404
        );
      }

      const { currentExperience, maxExperience, level } = character;
      const experienceLevel = this.levelUp({
        currentExperience,
        maxExperience,
        level,
        experienceToInrease: experience,
      });

      await character.updateOne(
        {
          currentExperience: experienceLevel.currentExperience,
          maxExperience: experienceLevel.maxExperience,
          level: experienceLevel.level,
        },
        { new: true, runValidators: true }
      );

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
        PUBLIC_ROUTES.Attributes
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
      ResponseCharacterAttributeCreateBundle,
      CharacterAttributeCreateBundleBody
    >(`${PUBLIC_ROUTES.CharacterAttributes}/bundle`, {
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
    >(PUBLIC_ROUTES.CharacterCurrencies, {
      characterCurrencies: defaultCharacterCurrencies,
    });

    //console.log('characterAttributesResponse: ', characterAttributesResponse.data);
    if (!characterCurrenciesResponse.success) {
      console.error('Something went wrong while creating character currencies');
      throw new Error('Character currencies error');
    }
  }

  private async createCharacterEquipment(characterId: string): Promise<void> {
    const equipmentArr: Omit<CharacterEquipmentFrontend, '_id'>[] = [];
    for (const e in EquipmentSlot) {
      const equipmentObj: Omit<CharacterEquipmentFrontend, '_id'> = {
        slot: e as EquipmentSlot,
        characterId: characterId,
        uiPosition: this.setUiPosition(e as EquipmentSlot),
        itemId: null,
      };
      equipmentArr.push(equipmentObj);
    }

    const characterEquipmentResponse = await this.apiService.post<
      Response_CharacterEquipment_POST,
      Request_CharacterEquipment_POST_body
    >(PUBLIC_ROUTES.CharacterEquipment, {
      characterEquipment: equipmentArr,
    });

    if (!characterEquipmentResponse.success) {
      console.error('Something went wrong while creating character equipment');
      throw new Error('Character equipment error');
    }
  }

  private async createCharacterInventory(characterId: string): Promise<void> {
    const inventoryItemsResponse = await this.apiService.post<
      Response_Inventory_POST,
      Request_Inventory_POST_body
    >(`${PUBLIC_ROUTES.Inventory}/${InventoryPostActions.NEW}`, {
      characterId: characterId,
    });

    if (!inventoryItemsResponse.success) {
      throw new Error('Character inventory error');
    }
  }

  private levelUp = (data: {
    currentExperience: number;
    maxExperience: number;
    level: number;
    experienceToInrease: number;
  }) => {
    if (
      data.currentExperience + data.experienceToInrease <
      data.maxExperience
    ) {
      data.currentExperience += data.experienceToInrease;
    } else {
      data.level++;
      data.experienceToInrease -= data.maxExperience;
      this.levelUp(data);
    }

    return {
      currentExperience: data.currentExperience,
      maxExperience: data.maxExperience,
      level: data.level,
    };
  };

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
        return UiPosition.LEFT;

      case EquipmentSlot.LEGS:
        return UiPosition.RIGHT;

      case EquipmentSlot.MAIN_HAND:
        return UiPosition.BOTTOM;
      default:
        return UiPosition.LEFT;
    }
  }
}
