import mongoose, { Schema } from 'mongoose';

import { InventoryBackend } from '../../../shared/src/interface/character/inventory.interface';
import { defaultInventorySlots, defaultMaxInventorySlots } from '../defaultCharacterData/inventory';

const inventorySchema = new Schema<InventoryBackend>({
  characterId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  'max-character-slot': {
    type: Number,
    default: defaultMaxInventorySlots,
    required: true
  },
  slots: {
    type: [{ slot: Number, itemId: Number, amount: Number }],
    default: defaultInventorySlots,
    required: true
  }
}, { timestamps: true });

export const InventoryModel = mongoose.model('Inventory', inventorySchema);