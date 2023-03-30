import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';

import { ICharacter } from '../../../shared/src';
import { defaultChracterAttributes } from '../defaultCharacterData/attributes';
import { defaultCharacterCurrencies } from '../defaultCharacterData/currencies';
import { defaultEquipmentSlots } from '../defaultCharacterData/equipmentSlots';
import { defaultInventorySlots, defaultMaxInventorySlots } from '../defaultCharacterData/inventory';

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
    type: Schema.Types.UUID
  },
  attributes: {
    type: [{ attributeId: String, 'base-value': Number, 'added-value': Number }],
    default: defaultChracterAttributes
  }
}, { timestamps: true });

export const CharacterModel = mongoose.model('Character', characterSchema);