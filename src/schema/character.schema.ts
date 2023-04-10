import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';

import { CharacterBackend } from '../../../shared/src';
import { defaultCharacterCurrencies } from '../defaultCharacterData/currencies';
import { defaultEquipmentSlots } from '../defaultCharacterData/equipmentSlots';

const characterSchema = new Schema<CharacterBackend>({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  name: {
    type: String,
    default: () => randomUUID(),
    required: true
  },
  adventures: {
    type: [{ adventureId: Number }],
    default: [],
    required: true
  },
  currencies: {
    type: [{ currencyId: Number, name: String, label: String, amount: Number, cap: Number }],
    default: defaultCharacterCurrencies,
    required: true
  },
  currentExperience: {
    type: Number,
    default: 0,
    required: true
  },
  maxExperience: {
    type: Number,
    default: 200,
    required: true
  },
  equipmentSlots: {
    type: [{ slot: String, equipment: String }],
    default: defaultEquipmentSlots,
    required: true
  },
  level: {
    type: Number,
    default: 1,
    required: true
  },
  inventoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  characterAttributes: {
    type: [Schema.Types.ObjectId],
    ref: 'CharacterAttribute'
  }
}, { timestamps: true });

export const CharacterModel = mongoose.model('Character', characterSchema);