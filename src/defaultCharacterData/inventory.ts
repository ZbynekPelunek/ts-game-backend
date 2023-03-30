import { InventorySlot } from '../../../shared/src/interface/inventory.interface';

export const defaultMaxInventorySlots = 10;

export const defaultInventorySlots: InventorySlot[] = [];

for (let i = 0; i < defaultMaxInventorySlots; i++) {
  defaultInventorySlots.push({ slot: i + 1, itemId: null });
}