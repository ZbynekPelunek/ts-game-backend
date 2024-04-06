import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { IAccountSchema } from '../../../shared/src';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'accounts' },
})
export class AccountSchema implements IAccountSchema {
  @prop({ required: true })
  public username!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ default: 0 })
  public level?: number;
}

export const AccountModel = getModelForClass(AccountSchema);
