import mongoose, { Schema } from 'mongoose';

import { CharacterAttribute } from '../../../shared/src';

const characterAttributeSchema = new Schema<CharacterAttribute>({
  characterId: {
    type: Schema.Types.ObjectId
  },
  attributeId: {
    type: String
  },
  'base-value': {
    type: Number,
    default: 0
  },
  'added-value': {
    type: Number,
    default: 0
  },
  'stats-value': {
    type: Number,
    default: 0
  },
  'total-value': {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export const CharacterAttributeModel = mongoose.model('CharacterAttribute', characterAttributeSchema);