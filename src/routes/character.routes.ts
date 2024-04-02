import axios, { AxiosResponse, isAxiosError } from 'axios';
import express, { Request, Response } from 'express';
import { Types, Document } from 'mongoose';

import { CharacterModel, CharacterSchema } from '../schema/character.schema';
import { generateDefaultCharacterAttributes } from '../defaultCharacterData/attributes';
import { generateCharacterCurrencies } from '../defaultCharacterData/currencies';
import { PUBLIC_ROUTES } from '../server';
import {
  Response_Character_GET_All,
  CharacterFrontend,
  Request_Character_POST_body,
  Response_Character_POST,
  Response_Attribute_GET_all,
  Response_CharacterAttribute_POST,
  Request_CharacterAttribute_POST_body,
  Response_CharacterCurrency_POST,
  Request_CharacterCurrency_POST_body,
  CharacterEquipmentFrontend,
  EquipmentSlot,
  Response_CharacterEquipment_POST,
  Request_CharacterEquipment_POST_body,
  Response_Inventory_POST,
  InventoryActions,
  Request_Character_GET_one_params,
  Request_Character_GET_one_query,
  Response_Character_GET_one,
  UiPosition,
} from '../../../shared/src';

export const charactersRouter = express.Router();

charactersRouter.get(
  '',
  async (_req: Request, res: Response<Response_Character_GET_All>) => {
    const characters = await CharacterModel.find();

    const responseCharacters: CharacterFrontend[] = characters.map(
      (character) => {
        return transformResponse(character);
      }
    );

    return res
      .status(200)
      .json({ success: true, characters: responseCharacters });
  }
);

charactersRouter.post(
  '',
  async (
    req: Request<{}, {}, Request_Character_POST_body>,
    res: Response<Response_Character_POST>
  ) => {
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

      character.characterAttributes =
        characterAttributesResponse.data.characterAttributes.map(
          (ca) => new Types.ObjectId(ca.characterAttributeId)
        );

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

      character.currencyIds =
        characterCurrenciesResponse.data.characterCurrencies.map(
          (cc) => new Types.ObjectId(cc.characterCurrencyId)
        );

      // EQUIPMENT PART
      const equipmentArr: CharacterEquipmentFrontend[] = [];
      for (const e in EquipmentSlot) {
        const equipmentObj: CharacterEquipmentFrontend = {
          slot: e as EquipmentSlot,
          characterId: character.id,
          uiPosition: setUiPosition(e as EquipmentSlot),
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

      character.equipment =
        characterEquipmentResponse.data.characterEquipment.map(
          (ce) => new Types.ObjectId(ce.equipmentId)
        );

      // INVENTORY PART
      const inventoryItemsResponse = await axios.post<Response_Inventory_POST>(
        `http://localhost:3000${PUBLIC_ROUTES.Inventory}?action=${InventoryActions.NEW}`,
        { characterId: character.id }
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

      character.inventory = inventoryItemsResponse.data.inventory.map((ii) => {
        return {
          slot: ii.slot,
          characterId: new Types.ObjectId(ii.characterId),
          amount: ii.amount,
          itemId: ii.itemId,
        };
      });

      //console.log('saving character: ', character);

      await character.save();

      await axios.post(
        `http://localhost:3000/api/v1/accounts/${characterBody.accountId}/characters`,
        { characterId: character._id }
      );

      //console.log('axios response: ', response);

      const responseCharacter: CharacterFrontend = transformResponse(character);

      return res.status(201).json({
        success: true,
        character: responseCharacter,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.message);
      }
      return res
        .status(500)
        .json({ success: false, error: 'Character creation failed' });
    }
  }
);

charactersRouter.get(
  '/:characterId',
  async (
    req: Request<
      Request_Character_GET_one_params,
      {},
      {},
      Request_Character_GET_one_query
    >,
    res: Response<Response_Character_GET_one>
  ) => {
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

    const responseCharacter: CharacterFrontend = transformResponse(character);

    // let populatedResponse;
    // if (populateInventory) {
    //   const populateResponse = await CharacterModel.populate<{ inventory: InventoryItemBackend[] }>(character, { path: 'inventory', select: '-createdAt -updatedAt -__v' });

    //   if (populateResponse.inventory.length > 0) {
    //     const inventoryResult: unknown[] = [];
    //     populateResponse.inventory.forEach(inv => {
    //       inventoryResult[inv.slot - 1] = {
    //         amount: inv.amount,
    //         characterId: inv.characterId.toString(),
    //         itemId: inv.itemId,
    //         slot: inv.slot
    //       } as InventoryItemFrontend
    //     });

    //     responseCharacter.inventoryItems = inventoryResult as InventoryItemFrontend[];
    //   }

    //   //console.log('populatedResponse: ', populatedResponse);
    // }

    return res
      .status(200)
      .json({ success: true, character: responseCharacter });
  }
);

function setUiPosition(equipSlot: EquipmentSlot): UiPosition {
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

const transformResponse = (
  databaseResponse: CharacterSchema & Document
): CharacterFrontend => {
  return {
    characterId: databaseResponse.id,
    accountId: databaseResponse.accountId.toString(),
    adventures:
      databaseResponse.adventures!.length > 0
        ? databaseResponse.adventures!.map((a) => a.toString())
        : [],
    characterAttributes:
      databaseResponse.characterAttributes!.length > 0
        ? databaseResponse.characterAttributes!.map((ca) => ca.toString())
        : [],
    currencyIds:
      databaseResponse.currencyIds!.length > 0
        ? databaseResponse.currencyIds!.map((c) => c.toString())
        : [],
    currentExperience: databaseResponse.currentExperience,
    equipment:
      databaseResponse.equipment!.length > 0
        ? databaseResponse.equipment!.map((e) => e.toString())
        : [],
    inventory: databaseResponse.inventory
      ? databaseResponse.inventory.map((i) => {
          return {
            inventoryId: i._id!.toString(),
            amount: i.amount ?? 0,
            characterId: i.characterId.toString(),
            itemId: i.itemId,
            slot: i.slot,
          };
        })
      : [],
    level: databaseResponse.level,
    maxExperience: databaseResponse.maxExperience,
    name: databaseResponse.name,
  };
};

// OLD CODE

// charactersRouter.put('/:characterId', (req: Request, res: Response) => {
//   const characterId = req.params.characterId;
//   if (characterId !== '1') {
//     throw new NotFoundError(`Character with id ${characterId} not found`);
//   }
//   // const charBody: Character = req.body.character;
//   // character = {
//   //   ...charBody
//   // }

//   return res.status(200).json({});
// })

// // ADVENTURES
// charactersRouter.get('/:characterId/adventures', (req: Request, res: Response<GET_characterAdventuresAll>) => {
//   const characterId = req.params.characterId;
//   if (characterId !== '1') {
//     throw new NotFoundError(`Character with id ${characterId} not found`);
//   }
//   const character = testCharacter;

//   return res.status(200).json({ character: { characterId, level: character.level }, adventures: character.adventures });
// })

// EQUIPMENT
// charactersRouter.get('/:characterId/equipment', (req: Request, res: Response<GET_characterEquipSlots>) => {
//   const characterId = req.params.characterId;
//   if (characterId !== '1') {
//     throw new NotFoundError(`Character with id ${characterId} not found`);
//   }
//   const character = testCharacter;
//   return res.status(200).json({ equipmentSlots: character.equipmentSlots });
// })

// charactersRouter.post('/:characterId/actions/:actionId', async (req: Request, res: Response<POST_characterActions>) => {
//   const { characterId } = req.params;
//   const actionId = req.params.actionId as CharacterActions;
//   const item: InventoryItem = req.body.item;

//   if (characterId !== '1') {
//     throw new NotFoundError(`Character with id ${characterId} not found`);
//   }
//   if (!item || item === null) {
//     throw new BadRequestError('Item body is empty');
//   }

//   let character = testCharacter;
//   let inventory: Inventory[] = [];
//   let equipmentSlots: EquipmentSlotsArr;
//   switch (actionId) {
//     case CharacterActions.EQUIP_ITEM:
//       if (item.itemType !== ItemType.EQUIPMENT) {
//         throw new BadRequestError('Item is not equipment');
//       }
//       inventory = [...character.inventory];
//       equipmentSlots = [...character.equipmentSlots];
//       try {
//         const checkInventoryResponse = await checkItemInInventory(item, character);
//         if (!checkInventoryResponse) {
//           throw new NotFoundError(`Equipment ${item.name} not found in inventory`);
//         }
//         const equipItemResponse = await equipItem(item, { ...character });
//         if (!equipItemResponse.succes) {
//           equipmentSlots = equipmentSlots;
//           throw new ServerError('Something went wrong while updating equipment slots');
//         }
//         const inventoryResponse = await updateInventoryEquipItem(item, [...inventory], equipItemResponse.previousEquipment);
//         if (!inventoryResponse.succes) {
//           equipmentSlots = equipmentSlots;
//           inventory = inventory;
//           throw new ServerError('Something went wrong while updating inventory');
//         } else {
//           character.inventory = inventoryResponse.inventory;
//           character.equipmentSlots = equipItemResponse.equipmentSlots;
//           return res.status(201).json({ character });
//         }

//       } catch (error) {
//         console.error(error);
//         throw new ServerError('Something went wrong while equiping item');
//       }
//       break;
//     case CharacterActions.UNEQUIP_ITEM:
//       if (item.itemType !== ItemType.EQUIPMENT) {
//         throw new BadRequestError('Item is not equipment');
//       }
//       inventory = [...character.inventory];
//       equipmentSlots = [...character.equipmentSlots];
//       try {
//         const itemsArr = inventory.map(items => items.item).filter(items => items !== null);
//         if (itemsArr.length >= inventory.length) {
//           throw new ServerError('Full Inventory');
//         }
//         console.log('equipment sent to unequipItem(): ', item);
//         const unequipResponse = await unequipItem(item, [...equipmentSlots]);
//         if (!unequipResponse.succes) {
//           equipmentSlots = equipmentSlots;
//           throw new ServerError('Something went wrong while updating equipment slots');
//         }
//         const inventoryResponse = await updateInventoryUnequipItem(item, [...inventory]);
//         if (!inventoryResponse.succes) {
//           equipmentSlots = equipmentSlots;
//           inventory = inventory;
//           throw new ServerError('Something went wrong while updating inventory');
//         } else {
//           character.inventory = inventoryResponse.inventory;
//           character.equipmentSlots = unequipResponse.equipmentSlots;
//           return res.status(201).json({ character });
//         }

//       } catch (error) {
//         console.error(error);
//         throw new ServerError('Something went wrong while unequiping item');
//       }
//     case CharacterActions.SELL:
//       if (item.equipped) {
//         equipmentSlots = [...character.equipmentSlots];
//         const sellEquipResponse = await sellEquipment(<EquipableItem>item, equipmentSlots);
//         if (!sellEquipResponse) {
//           throw new ServerError(`Something went wrong while selling equipment from equipment slots`);
//         }
//         character.equipmentSlots = equipmentSlots;
//       } else {
//         inventory = [...character.inventory];
//         const sellItemResponse = await sellItem(item, inventory);
//         if (!sellItemResponse) {
//           throw new ServerError(`Something went wrong while selling item from inventory`);
//         }
//         character.inventory = inventory;
//       }
//       //character.updateCurrencies({ gold: item.sellValue, cheating_currency: '0' });

//       return res.status(201).json({ character });
//     default:
//       throw new NotFoundError(`Action with id ${actionId} not found`);
//   }
// })

// const checkItemInInventory = async (equipment: EquipableItem, character: ICharacter): Promise<boolean> => {
//   if (equipment.positionIndex! >= 0 && _.isEqual(character.inventory[equipment.positionIndex!].item, equipment)) {
//     return true;
//   } else {
//     console.log('item not found in inventory');
//     return false;
//   }

// }

// const equipItem = async (equipment: EquipableItem, character: ICharacter): Promise<{ succes: boolean; equipmentSlots: EquipmentSlotsArr, previousEquipment: EquipableItem | null }> => {
//   const equipSlotIndex = character.equipmentSlots.findIndex(es => es.slot === equipment.slot);
//   if (equipSlotIndex < 0) {
//     return { succes: false, equipmentSlots: character.equipmentSlots, previousEquipment: null }
//   }

//   const previousEquipment: EquipableItem | null = character.equipmentSlots[equipSlotIndex].equipment;

//   character.equipmentSlots[equipSlotIndex].equipment = {
//     ...equipment,
//     positionIndex: equipSlotIndex,
//     equipped: true
//   };
//   if (previousEquipment !== null) {
//     testCharacter.updateStats(equipment.statsEffects.default, previousEquipment.statsEffects.default);
//     testCharacter.updateStats(equipment.statsEffects.rolledAffixes, previousEquipment.statsEffects.rolledAffixes);
//   } else {
//     testCharacter.updateStats(equipment.statsEffects.default);
//     testCharacter.updateStats(equipment.statsEffects.rolledAffixes);
//   }

//   return { succes: true, equipmentSlots: character.equipmentSlots, previousEquipment };

// }

// const unequipItem = async (equipment: EquipableItem, equipmentSlots: EquipmentSlotsArr): Promise<{ succes: boolean; equipmentSlots: EquipmentSlotsArr }> => {
//   console.log('unequipItem() equipment: ', equipment);
//   const equipSlotIndex = equipment.positionIndex;
//   console.log('equipSlotIndex: ', equipSlotIndex);
//   if (equipSlotIndex! < 0) {
//     return { succes: false, equipmentSlots }
//   }

//   equipmentSlots[equipSlotIndex!].equipment = null;

//   testCharacter.updateStats(undefined, equipment.statsEffects.default);
//   testCharacter.updateStats(undefined, equipment.statsEffects.rolledAffixes);

//   return { succes: true, equipmentSlots };

// }

// const updateInventoryEquipItem = async (equipment: EquipableItem, inventory: Inventory[], previousEquipment: EquipableItem | null): Promise<{ succes: boolean; inventory: Inventory[] }> => {
//   const inventorySlotIndex = equipment.positionIndex;
//   if (inventorySlotIndex! < 0) {
//     return { succes: false, inventory }
//   }

//   inventory[inventorySlotIndex!].item = previousEquipment === null ? null : { ...previousEquipment, positionIndex: inventorySlotIndex, equipped: false }

//   return { succes: true, inventory };
// }

// const updateInventoryUnequipItem = async (equipment: EquipableItem, inventory: Inventory[]): Promise<{ succes: boolean; inventory: Inventory[] }> => {
//   const freeSpotIndex = inventory.findIndex(inv => inv.item === null);

//   inventory[freeSpotIndex].item = { ...equipment, positionIndex: freeSpotIndex, equipped: false };

//   return { succes: true, inventory };
// }

// const sellEquipment = async (equipment: EquipableItem, equipmentSlots: EquipmentSlotsArr): Promise<boolean> => {
//   const equipSlotIndex = equipment.positionIndex;
//   if (equipSlotIndex! < 0) {
//     return false;
//   }
//   equipmentSlots[equipSlotIndex!].equipment = null;

//   return true;
// }

// const sellItem = async (item: InventoryItem, inventory: Inventory[]): Promise<boolean> => {
//   const inventoryIndex = item.positionIndex;
//   if (inventoryIndex! < 0) {
//     return false;
//   }
//   inventory[inventoryIndex!].item = null;

//   return true;
// }

// charactersRouter.put('/:characterId/equipment', (req: Request, res: Response) => {
//   const { characterId } = req.params;
//   const equipment: EquipableItems = req.body.equipment;
//   if (characterId !== '1') {
//     return res.status(404).json({
//       error: 'Not Found',
//       message: `Character with id ${characterId} not found`
//     })
//   }
//   if (!equipment || equipment === null) {
//     return res.status(400).json({
//       error: 'Incorrect body',
//       message: 'Equipment body is empty'
//     })
//   }
//   const itemEquipped = character.equipItem(equipment);
//   if (!itemEquipped) {
//     return res.status(500).json({
//       error: 'Server Error',
//       message: `Couldn't equip ${equipment.name} for unknown reason`
//     })
//   }
//   return res.status(201).json({
//     message: `Character equipped with ${equipment.name}`,
//     character
//   })
// })

// charactersRouter.delete('/:characterId/equipment', (req: Request, res: Response) => {
//   const { characterId } = req.params;
//   const equipment: IArmor | IWeapon = req.body.equipment;
//   if (characterId !== '1') {
//     return res.status(404).json({
//       error: 'Not Found',
//       message: `Character with id ${characterId} not found`
//     })
//   }
//   if (!equipment || equipment === null) {
//     return res.status(400).json({
//       error: 'Incorrect body',
//       message: 'Equipment body is empty'
//     })
//   }
//   const itemUnequipped = character.unequipItem(equipment);
//   if (!itemUnequipped) {
//     return res.status(500).json({
//       error: 'Server Error',
//       message: `Couldn't unequip ${equipment.name} for unknown reason`
//     })
//   }
//   return res.status(201).json({
//     message: `Character unequipped with ${equipment.name}`,
//     character
//   })
// })

// INVENTORY
// charactersRouter.get('/:id/inventory', (req: Request, res: Response) => {
//   const characterId = req.params.id;
//   if (characterId !== '1') {
//     return res.status(404).json({
//       error: 'Not Found',
//       message: `Character with id ${characterId} not found`
//     })
//   }
//   const character = testCharacter;

//   return res.status(200).json({ inventory: character.inventory });
// })
