import mongoose, { Schema } from 'mongoose';

import { Account } from '../../../shared/src/interface/account.interface';

const accountSchema = new Schema<Account>({
  username: String,
  email: String,
  password: String,
  characters: [{
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Character',
      alias: 'characterId'
    }
  }],
  level: Number,
  adventureResults: [{
    _id: {
      type: Schema.Types.ObjectId
    }
  }]
}, { timestamps: true });

export const AccountModel = mongoose.model('Account', accountSchema);