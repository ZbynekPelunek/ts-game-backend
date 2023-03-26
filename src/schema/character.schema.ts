import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';

import { ICharacter } from '../../../shared/src';
import { defaultCharacterCurrencies2 } from '../defaultCharacterData/currencies';
import { defaultEquipmentSlots } from '../defaultCharacterData/equipmentSlots';
import { defaultInventory, defaultMaxInventorySlots } from '../defaultCharacterData/inventory';

const characterSchema = new Schema<ICharacter>({
  _id: {
    type: Schema.Types.UUID,
    default: () => randomUUID(),
    alias: 'characterId'
  },
  accountId: {
    type: Schema.Types.UUID,
  },
  name: {
    type: String,
    default: () => randomUUID()
  },
  adventures: [String],
  currencies: {
    type: [{ currencyId: Number, name: String, label: String, amount: Number, cap: Number }],
    default: defaultCharacterCurrencies2
  },
  currentExperience: {
    type: Number,
    default: 0
  },
  maxExperience: {
    type: Number,
    default: 200
  },
  equipmentSlots: {
    type: [{ slot: String, equipment: String }],
    default: defaultEquipmentSlots
  },
  level: {
    type: Number,
    default: 1
  },
  maxInventorySlots: {
    type: Number,
    default: defaultMaxInventorySlots
  },
  inventory: {
    type: [{ item: Schema.Types.String }],
    default: defaultInventory
  },
  stats: [String]
}, { timestamps: true });

export const CharacterModel = mongoose.model('Character', characterSchema);