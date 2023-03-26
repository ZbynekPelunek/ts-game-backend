import { Inventory } from '../../../shared/src/interface/character.interface';

export const defaultMaxInventorySlots = 10;

export const defaultInventory: Inventory[] = [];
for (let i = 0; i < defaultMaxInventorySlots; i++) {
  defaultInventory.push({ item: null });
}