import mongoose, { Schema } from 'mongoose';

interface Account {
  username: string;
  email: string;
  password: string;
}

const accountSchema = new Schema<Account>({
  username: String,
  email: String,
  password: String
});

export const AccountModel = mongoose.model('Account', accountSchema);