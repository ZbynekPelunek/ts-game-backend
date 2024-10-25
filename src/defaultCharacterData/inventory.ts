import { Types } from 'mongoose';

import { InventoryBackend } from '../../../shared/src';

export const defaultMaxInventorySlots = 16;

export const generateCharacterInventory = (
  characterId: string,
  maxInventorySlots?: number,
  item?: { itemId: number; amount: number }
): InventoryBackend[] => {
  const defaultInventorySlots: InventoryBackend[] = [];
  const convertCharacterId = new Types.ObjectId(characterId);
  const maxSlots = maxInventorySlots ?? defaultMaxInventorySlots;

  for (let i = 0; i < maxSlots; i++) {
    defaultInventorySlots.push({
      slot: i + 1,
      item: item ?? null,
      characterId: convertCharacterId,
    });
  }

  return defaultInventorySlots;
};
