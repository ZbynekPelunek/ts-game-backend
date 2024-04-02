import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { CharacterSchema } from './character.schema';
import { AccountBackend } from '../../../shared/src';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'accounts' },
})
export class AccountSchema implements AccountBackend {
  @prop({ required: true })
  public username!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true, default: [], ref: () => CharacterSchema })
  public characters!: Types.ObjectId[];

  @prop({ required: true, default: 0 })
  public level!: number;
}

export const AccountModel = getModelForClass(AccountSchema);
