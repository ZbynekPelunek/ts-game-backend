import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';

import { CharacterBackend } from '../../../shared/src';
import { defaultCharacterCurrencies } from '../defaultCharacterData/currencies';
import { defaultEquipmentSlots } from '../defaultCharacterData/equipmentSlots';

const characterSchema = new Schema<CharacterBackend>({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  name: {
    type: String,
    default: () => randomUUID()
  },
  adventures: {
    type: [{ adventureId: Number }]
  },
  currencies: {
    type: [{ currencyId: Number, name: String, label: String, amount: Number, cap: Number }],
    default: defaultCharacterCurrencies
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
  inventoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Inventory'
  },
  characterAttributes: [{
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'CharacterAttributes'
    }
  }]
}, { timestamps: true });

export const CharacterModel = mongoose.model('Character', characterSchema);