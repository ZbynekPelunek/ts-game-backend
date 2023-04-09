import mongoose, { Schema } from 'mongoose';

import { CharacterAttributeBackend } from '../../../shared/src';

const characterAttributeSchema = new Schema<CharacterAttributeBackend>({
  characterId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  attributeId: {
    type: String,
    required: true
  },
  'base-value': {
    type: Number,
    default: 0,
    required: true
  },
  'added-value': {
    type: Number,
    default: 0,
    required: true
  },
  'stats-added-value': {
    type: Number,
    default: 0,
    required: true
  },
  'total-value': {
    type: Number,
    default: 0,
    required: true
  }
}, { timestamps: true });

export const CharacterAttributeModel = mongoose.model('CharacterAttribute', characterAttributeSchema);