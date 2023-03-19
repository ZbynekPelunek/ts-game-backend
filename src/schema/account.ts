import mongoose, { Schema } from 'mongoose';

interface Account {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  characters: { characterId: string }[];
  level: number;
}

const accountSchema = new Schema<Account>({
  _id: String,
  username: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date,
  characters: [{ characterId: String }],
  level: Number
});

export const AccountModel = mongoose.model('Account', accountSchema);