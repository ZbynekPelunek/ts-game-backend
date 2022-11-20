import express, { Request, Response } from 'express';
import * as _ from 'lodash';

import {
  CharacterActions,
  EquipableItem,
  EquipmentSlotsArr,
  GET_characterAdventuresAll,
  GET_characterByID,
  GET_characterEquipSlots,
  ICharacter,
  Inventory,
  InventoryItem,
  ItemType,
  POST_characterActions,
  PUT_characterByID,
} from '../../../shared/src';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { ServerError } from '../errors/server-error';
import { testCharacter } from '../test/testCharacter';

export const charactersRouter = express.Router();

charactersRouter.get('/:characterId', (req: Request, res: Response<GET_characterByID>) => {
  const characterId = req.params.characterId;
  if (characterId !== '1') {
    throw new NotFoundError(`Character with id ${characterId} not found`);
  }
  const character = testCharacter;

  return res.status(200).json({ character });
})

charactersRouter.put('/:characterId', (req: Request, res: Response<PUT_characterByID>) => {
  const characterId = req.params.characterId;
  if (characterId !== '1') {
    throw new NotFoundError(`Character with id ${characterId} not found`);
  }
  // const charBody: Character = req.body.character;
  // character = {
  //   ...charBody
  // }
  const character = testCharacter;

  return res.status(200).json({ character });
})

// ADVENTURES
charactersRouter.get('/:characterId/adventures', (req: Request, res: Response<GET_characterAdventuresAll>) => {
  const characterId = req.params.characterId;
  if (characterId !== '1') {
    throw new NotFoundError(`Character with id ${characterId} not found`);
  }
  const character = testCharacter;

  return res.status(200).json({ character: { characterId, level: character.level }, adventures: character.adventures });
})

// EQUIPMENT
charactersRouter.get('/:characterId/equipment', (req: Request, res: Response<GET_characterEquipSlots>) => {
  const characterId = req.params.characterId;
  if (characterId !== '1') {
    throw new NotFoundError(`Character with id ${characterId} not found`);
  }
  const character = testCharacter;
  return res.status(200).json({ equipmentSlots: character.equipmentSlots });
})

charactersRouter.post('/:characterId/actions/:actionId', async (req: Request, res: Response<POST_characterActions>) => {
  const { characterId } = req.params;
  const actionId = req.params.actionId as CharacterActions;
  const item: InventoryItem = req.body.item;

  if (characterId !== '1') {
    throw new NotFoundError(`Character with id ${characterId} not found`);
  }
  if (!item || item === null) {
    throw new BadRequestError('Item body is empty');
  }

  let character = testCharacter;
  let inventory: Inventory[] = [];
  let equipmentSlots: EquipmentSlotsArr;
  switch (actionId) {
    case CharacterActions.EQUIP_ITEM:
      if (item.itemType !== ItemType.EQUIPMENT) {
        throw new BadRequestError('Item is not equipment');
      }
      inventory = [...character.inventory];
      equipmentSlots = [...character.equipmentSlots];
      try {
        const checkInventoryResponse = await checkItemInInventory(item, character);
        if (!checkInventoryResponse) {
          throw new NotFoundError(`Equipment ${item.name} not found in inventory`);
        }
        const equipItemResponse = await equipItem(item, { ...character });
        if (!equipItemResponse.succes) {
          equipmentSlots = equipmentSlots;
          throw new ServerError('Something went wrong while updating equipment slots');
        }
        const inventoryResponse = await updateInventoryEquipItem(item, [...inventory], equipItemResponse.previousEquipment);
        if (!inventoryResponse.succes) {
          equipmentSlots = equipmentSlots;
          inventory = inventory;
          throw new ServerError('Something went wrong while updating inventory');
        } else {
          character.inventory = inventoryResponse.inventory;
          character.equipmentSlots = equipItemResponse.equipmentSlots;
          return res.status(201).json({ character });
        }

      } catch (error) {
        console.error(error);
        throw new ServerError('Something went wrong while equiping item');
      }
      break;
    case CharacterActions.UNEQUIP_ITEM:
      if (item.itemType !== ItemType.EQUIPMENT) {
        throw new BadRequestError('Item is not equipment');
      }
      inventory = [...character.inventory];
      equipmentSlots = [...character.equipmentSlots];
      try {
        const itemsArr = inventory.map(items => items.item).filter(items => items !== null);
        if (itemsArr.length >= inventory.length) {
          throw new ServerError('Full Inventory');
        }
        console.log('equipment sent to unequipItem(): ', item);
        const unequipResponse = await unequipItem(item, [...equipmentSlots]);
        if (!unequipResponse.succes) {
          equipmentSlots = equipmentSlots;
          throw new ServerError('Something went wrong while updating equipment slots');
        }
        const inventoryResponse = await updateInventoryUnequipItem(item, [...inventory]);
        if (!inventoryResponse.succes) {
          equipmentSlots = equipmentSlots;
          inventory = inventory;
          throw new ServerError('Something went wrong while updating inventory');
        } else {
          character.inventory = inventoryResponse.inventory;
          character.equipmentSlots = unequipResponse.equipmentSlots;
          return res.status(201).json({ character });
        }

      } catch (error) {
        console.error(error);
        throw new ServerError('Something went wrong while unequiping item');
      }
    case CharacterActions.SELL:
      if (item.equipped) {
        equipmentSlots = [...character.equipmentSlots];
        const sellEquipResponse = await sellEquipment(<EquipableItem>item, equipmentSlots);
        if (!sellEquipResponse) {
          throw new ServerError(`Something went wrong while selling equipment from equipment slots`);
        }
        character.equipmentSlots = equipmentSlots;
      } else {
        inventory = [...character.inventory];
        const sellItemResponse = await sellItem(item, inventory);
        if (!sellItemResponse) {
          throw new ServerError(`Something went wrong while selling item from inventory`);
        }
        character.inventory = inventory;
      }
      character.updateCurrencies({ gold: item.sellValue, cheating_currency: '0' });

      return res.status(201).json({ character });
    default:
      throw new NotFoundError(`Action with id ${actionId} not found`);
  }
})

const checkItemInInventory = async (equipment: EquipableItem, character: ICharacter): Promise<boolean> => {
  if (equipment.positionIndex! >= 0 && _.isEqual(character.inventory[equipment.positionIndex!].item, equipment)) {
    return true;
  } else {
    console.log('item not found in inventory');
    return false;
  }

}

const equipItem = async (equipment: EquipableItem, character: ICharacter): Promise<{ succes: boolean; equipmentSlots: EquipmentSlotsArr, previousEquipment: EquipableItem | null }> => {
  const equipSlotIndex = character.equipmentSlots.findIndex(es => es.slot === equipment.slot);
  if (equipSlotIndex < 0) {
    return { succes: false, equipmentSlots: character.equipmentSlots, previousEquipment: null }
  }

  const previousEquipment: EquipableItem | null = character.equipmentSlots[equipSlotIndex].equipment;

  character.equipmentSlots[equipSlotIndex].equipment = {
    ...equipment,
    positionIndex: equipSlotIndex,
    equipped: true
  };
  if (previousEquipment !== null) {
    testCharacter.updateStats(equipment.statsEffects.default, previousEquipment.statsEffects.default);
    testCharacter.updateStats(equipment.statsEffects.rolledAffixes, previousEquipment.statsEffects.rolledAffixes);
  } else {
    testCharacter.updateStats(equipment.statsEffects.default);
    testCharacter.updateStats(equipment.statsEffects.rolledAffixes);
  }

  return { succes: true, equipmentSlots: character.equipmentSlots, previousEquipment };

}

const unequipItem = async (equipment: EquipableItem, equipmentSlots: EquipmentSlotsArr): Promise<{ succes: boolean; equipmentSlots: EquipmentSlotsArr }> => {
  console.log('unequipItem() equipment: ', equipment);
  const equipSlotIndex = equipment.positionIndex;
  console.log('equipSlotIndex: ', equipSlotIndex);
  if (equipSlotIndex! < 0) {
    return { succes: false, equipmentSlots }
  }

  equipmentSlots[equipSlotIndex!].equipment = null;

  testCharacter.updateStats(undefined, equipment.statsEffects.default);
  testCharacter.updateStats(undefined, equipment.statsEffects.rolledAffixes);

  return { succes: true, equipmentSlots };

}

const updateInventoryEquipItem = async (equipment: EquipableItem, inventory: Inventory[], previousEquipment: EquipableItem | null): Promise<{ succes: boolean; inventory: Inventory[] }> => {
  const inventorySlotIndex = equipment.positionIndex;
  if (inventorySlotIndex! < 0) {
    return { succes: false, inventory }
  }

  inventory[inventorySlotIndex!].item = previousEquipment === null ? null : { ...previousEquipment, positionIndex: inventorySlotIndex, equipped: false }

  return { succes: true, inventory };
}

const updateInventoryUnequipItem = async (equipment: EquipableItem, inventory: Inventory[]): Promise<{ succes: boolean; inventory: Inventory[] }> => {
  const freeSpotIndex = inventory.findIndex(inv => inv.item === null);

  inventory[freeSpotIndex].item = { ...equipment, positionIndex: freeSpotIndex, equipped: false };

  return { succes: true, inventory };
}

const sellEquipment = async (equipment: EquipableItem, equipmentSlots: EquipmentSlotsArr): Promise<boolean> => {
  const equipSlotIndex = equipment.positionIndex;
  if (equipSlotIndex! < 0) {
    return false;
  }
  equipmentSlots[equipSlotIndex!].equipment = null;

  return true;
}

const sellItem = async (item: InventoryItem, inventory: Inventory[]): Promise<boolean> => {
  const inventoryIndex = item.positionIndex;
  if (inventoryIndex! < 0) {
    return false;
  }
  inventory[inventoryIndex!].item = null;

  return true;
}

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
charactersRouter.get('/:id/inventory', (req: Request, res: Response) => {
  const characterId = req.params.id;
  if (characterId !== '1') {
    return res.status(404).json({
      error: 'Not Found',
      message: `Character with id ${characterId} not found`
    })
  }
  const character = testCharacter;

  return res.status(200).json({ inventory: character.inventory });
})