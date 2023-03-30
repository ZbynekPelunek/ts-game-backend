import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';

import { CharacterAttribute } from '../../../shared/src';

const characterAttributeSchema = new Schema<CharacterAttribute>({
  characterId: {
    type: Schema.Types.UUID
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
  }
});

export const CharacterAttributeModel = mongoose.model('CharacterAttribute', characterAttributeSchema);