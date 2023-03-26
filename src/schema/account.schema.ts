import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';

import { Account } from '../../../shared/src/interface/account.interface';

const accountSchema = new Schema<Account>({
  _id: {
    type: Schema.Types.UUID,
    default: () => randomUUID(),
    alias: 'accountId'
  },
  username: String,
  email: String,
  password: String,
  characters: [{
    _id: {
      type: Schema.Types.UUID,
      ref: 'Character',
      alias: 'characterId'
    }
  }],
  level: Number,
  adventureResults: [{
    _id: {
      type: Schema.Types.UUID
    }
  }]
}, { timestamps: true });

export const AccountModel = mongoose.model('Account', accountSchema);