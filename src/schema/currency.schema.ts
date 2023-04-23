import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { Currency, CurrencyId } from '../../../shared/src';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'currencies' } })
export class CurrencySchema implements Currency {
  @prop({ required: true })
  public _id!: CurrencyId;

  @prop({ required: true, default: 'MISSING-NAME' })
  public name!: string;

  @prop({ required: true, default: 'MISSING-LABEL' })
  public label!: string;

  @prop()
  public desc?: string;

  @prop()
  public cap?: number;
}

export const CurrencyModel = getModelForClass(CurrencySchema);