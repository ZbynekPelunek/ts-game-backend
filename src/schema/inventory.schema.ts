import mongoose, { Schema } from 'mongoose';

import { Inventory } from '../../../shared/src';
import { defaultInventorySlots, defaultMaxInventorySlots } from '../defaultCharacterData/inventory';

const inventorySchema = new Schema<Inventory>({
  characterId: {
    type: Schema.Types.ObjectId
  },
  'max-character-slot': {
    type: Number,
    default: defaultMaxInventorySlots
  },
  slots: {
    type: [{ slot: Number, itemId: Number, amount: Number }],
    default: defaultInventorySlots
  }
}, { timestamps: true });

export const InventoryModel = mongoose.model('Inventory', inventorySchema);