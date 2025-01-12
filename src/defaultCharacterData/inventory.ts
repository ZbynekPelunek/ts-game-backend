import { Types } from 'mongoose';

import { InventoryBackend } from '../../../shared/src';

export const defaultMaxInventorySlots = 16;

export const generateCharacterInventory = (
  characterId: string,
  maxInventorySlots?: number
): InventoryBackend[] => {
  const defaultInventorySlots: InventoryBackend[] = [];
  const convertCharacterId = new Types.ObjectId(characterId);
  const maxSlots = maxInventorySlots ?? defaultMaxInventorySlots;

  for (let i = 0; i < maxSlots; i++) {
    defaultInventorySlots.push({
      slot: i + 1,
      item: {
        itemId: 1,
        amount: 1,
      },
      characterId: convertCharacterId,
    });
  }

  return defaultInventorySlots;
};
