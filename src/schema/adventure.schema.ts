import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';

const adventureSchema = new Schema({
  _id: {
    type: Schema.Types.UUID,
    default: () => randomUUID(),
    alias: 'adventureId'
  }
});

export const AdventureModel = mongoose.model('Adventure', adventureSchema);