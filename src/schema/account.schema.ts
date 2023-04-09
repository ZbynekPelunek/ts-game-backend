import mongoose, { Schema } from 'mongoose';

import { AccountBackend } from '../../../shared/src';

const accountSchema = new Schema<AccountBackend>({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  characters: [{
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Character',
      alias: 'characterId'
    }
  }],
  level: {
    type: Number,
    default: 0,
    required: true
  },
}, { timestamps: true });

export const AccountModel = mongoose.model('Account', accountSchema);