import { Request, Response } from 'express';
import axios, { AxiosResponse, isAxiosError } from 'axios';

import {
  AdventureTypes,
  CharacterBackend,
  CharacterEquipmentFrontend,
  CharacterFrontend,
  EquipmentSlot,
  InventoryActions,
  Request_Adventure_GET_all_query,
  Request_Character_GET_all_query,
  Request_Character_GET_one_params,
  Request_Character_GET_one_query,
  Request_Character_POST_body,
  Request_CharacterAttribute_POST_body,
  Request_CharacterCurrency_POST_body,
  Request_CharacterEquipment_POST_body,
  Request_Inventory_POST_body,
  Request_Inventory_POST_query,
  Response_Adventure_GET_all,
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
import { PUBLIC_ROUTES } from '../server';

export class CharacterController {
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
      return res
        .status(500)
        .json({ success: false, error: 'Character Get All Error [TBI]' });
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
        return res.status(404).json({
          success: false,
          error: `Character with id '${characterId}' not found`,
        });
      }

      //console.log('GET character db response: ', character);

      const responseCharacter: CharacterFrontend =
        this.transformResponse(character);

      return res
        .status(200)
        .json({ success: true, character: responseCharacter });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Character Get One Error [TBI]' });
    }
  }

  async post(
    req: Request<{}, {}, Request_Character_POST_body>,
    res: Response<Response_Character_POST>
  ) {
    try {
      const characterBody = req.body;

      const character = new CharacterModel({
        accountId: characterBody.accountId,
        name: characterBody.name,
        maxInventorySlot: 20,
      });

      // ATTRIBUTES PART
      const allAttributesResponse = await axios.get<Response_Attribute_GET_all>(
        'http://localhost:3000/api/v1/attributes'
      );

      if (!allAttributesResponse.data.success) {
        return res.status(500).json({
          success: false,
          error: 'Couldnt GET all attributes while creating character',
        });
      }

      //console.log('allAttributesResponse: ', allAttributesResponse.data)

      const defaultCharacterAttributes = generateDefaultCharacterAttributes(
        allAttributesResponse.data.attributes,
        character.id
      );

      const characterAttributesResponse = await axios.post<
        Response_CharacterAttribute_POST,
        AxiosResponse<
          Response_CharacterAttribute_POST,
          Request_CharacterAttribute_POST_body
        >,
        Request_CharacterAttribute_POST_body
      >('http://localhost:3000/api/v1/character-attributes', {
        characterAttributes: defaultCharacterAttributes,
      });

      //console.log('characterAttributesResponse: ', characterAttributesResponse.data);
      if (!characterAttributesResponse.data.success) {
        console.error(
          'Something went wrong while creating character attributes'
        );
        return res.status(500).json({
          success: false,
          error: 'Character attributes error',
        });
      }

      // CURRENCY PART
      const defaultCharacterCurrencies = generateCharacterCurrencies(
        character.id
      );

      const characterCurrenciesResponse = await axios.post<
        Response_CharacterCurrency_POST,
        AxiosResponse<
          Response_CharacterCurrency_POST,
          Request_CharacterCurrency_POST_body
        >,
        Request_CharacterCurrency_POST_body
      >('http://localhost:3000/api/v1/character-currencies', {
        characterCurrencies: defaultCharacterCurrencies,
      });

      //console.log('characterAttributesResponse: ', characterAttributesResponse.data);
      if (!characterCurrenciesResponse.data.success) {
        console.error(
          'Something went wrong while creating character currencies'
        );
        return res.status(500).json({
          success: false,
          error: 'Character currencies error',
        });
      }

      // EQUIPMENT PART
      const equipmentArr: CharacterEquipmentFrontend[] = [];
      for (const e in EquipmentSlot) {
        const equipmentObj: CharacterEquipmentFrontend = {
          slot: e as EquipmentSlot,
          characterId: character.id,
          uiPosition: this.setUiPosition(e as EquipmentSlot),
          equipmentId: '',
        };
        equipmentArr.push(equipmentObj);
      }

      const characterEquipmentResponse = await axios.post<
        Response_CharacterEquipment_POST,
        AxiosResponse<
          Response_CharacterEquipment_POST,
          Request_CharacterEquipment_POST_body
        >,
        Request_CharacterEquipment_POST_body
      >('http://localhost:3000/api/v1/character-equipment', {
        characterEquipment: equipmentArr,
      });

      if (!characterEquipmentResponse.data.success) {
        console.error(
          'Something went wrong while creating character equipment'
        );
        return res.status(500).json({
          success: false,
          error: 'Character equipment error',
        });
      }

      // INVENTORY PART
      const inventoryQuery: Request_Inventory_POST_query = {
        action: InventoryActions.NEW,
      };
      const inventoryItemsResponse = await axios.post<
        Response_Inventory_POST,
        AxiosResponse<Response_Inventory_POST, Request_Inventory_POST_body>,
        Request_Inventory_POST_body
      >(
        `http://localhost:3000${PUBLIC_ROUTES.Inventory}`,
        { characterId: character.id },
        { params: inventoryQuery }
      );
      console.log(
        'Characters POST inventoryItemsResponse: ',
        inventoryItemsResponse.data
      );
      if (!inventoryItemsResponse.data.success) {
        console.error(
          'Something went wrong while creating character inventory: ',
          inventoryItemsResponse.data
        );
        return res.status(500).json({
          success: false,
          error: 'Character inventory error',
        });
      }

      //console.log('saving character: ', character);

      const adventuresQuery: Request_Adventure_GET_all_query = {
        type: AdventureTypes.TUTORIAL,
      };
      const adventuresDataResponse =
        await axios.get<Response_Adventure_GET_all>(
          `http://localhost:3000${PUBLIC_ROUTES.Adventures}`,
          { params: adventuresQuery }
        );

      if (!adventuresDataResponse.data.success) {
        console.error(
          'Something went wrong while creating adding adventures: ',
          adventuresDataResponse.data
        );
        return res.status(500).json({
          success: false,
          error: 'Character adventures error',
        });
      }

      character.adventures = adventuresDataResponse.data.adventures.map(
        (a) => a._id
      );

      await character.save();

      // ACCOUNT PART (Not neccessary?)
      // await axios.patch<
      //   Response_Account_PATCH,
      //   AxiosResponse<Response_Account_PATCH, Request_Account_PATCH_body>,
      //   Request_Account_PATCH_body
      // >(
      //   `http://localhost:3000/api/v1/accounts/${characterBody.accountId}/characters`,
      //   { characterId: character.id }
      // );

      //console.log('axios response: ', response);

      const responseCharacter = this.transformResponse(character);

      return res.status(201).json({
        success: true,
        character: responseCharacter,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Axios error: ', error.message);
      }
      return res
        .status(500)
        .json({ success: false, error: 'Character Post Error [TBI]' });
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
