import { Types } from 'mongoose';
import { InventoryItemBackend } from '../../../shared/src/interface/character/inventoryItems.interface';

export const defaultMaxInventorySlots = 10;

export const generateCharacterInventory = (characterId: string, maxInventorySlots?: number, itemId?: number, amount?: number): InventoryItemBackend[] => {
  const defaultInventorySlots: InventoryItemBackend[] = [];
  const convertCharacterId = new Types.ObjectId(characterId);
  const maxSlots = maxInventorySlots ?? defaultMaxInventorySlots;

  for (let i = 0; i < maxSlots; i++) {
    defaultInventorySlots.push(
      {
        slot: i + 1,
        itemId: itemId ?? null,
        characterId: convertCharacterId,
        amount: amount ?? 0
      }
    );
  }

  return defaultInventorySlots;
}