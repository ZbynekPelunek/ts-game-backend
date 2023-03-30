import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';

import { Inventory } from '../../../shared/src';
import { defaultInventorySlots, defaultMaxInventorySlots } from '../defaultCharacterData/inventory';

const inventorySchema = new Schema<Inventory>({
  _id: {
    type: Schema.Types.UUID,
    default: () => randomUUID(),
    alias: 'inventoryId'
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