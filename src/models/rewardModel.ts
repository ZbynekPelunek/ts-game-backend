import {
  ArraySubDocumentType,
  getModelForClass,
  modelOptions,
  prop
} from '@typegoose/typegoose';

import {
  CommonItemsEquipmenParams,
  Currency,
  RewardMongooseSchema,
  RewardCurrency,
  RewardItem
} from '../../../shared/src';
import { CurrencySchema } from './currency';
import { EquipmentSchema } from './item.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'rewards' }
})
export class RewardSchema implements RewardMongooseSchema {
  @prop({ required: true })
  public _id!: number;

  @prop({ default: [], type: () => RewardCurrencySchema, _id: false })
  public currencies?: [
    ArraySubDocumentType<RewardCurrencySchema>,
    ...ArraySubDocumentType<RewardCurrencySchema>[]
  ];

  @prop({ default: 0 })
  public experience?: number;

  @prop({ default: [], type: () => RewardItemSchema, _id: false })
  public items?: [
    ArraySubDocumentType<RewardItemSchema>,
    ...ArraySubDocumentType<RewardItemSchema>[]
  ];
}

export class RewardCurrencySchema implements RewardCurrency {
  @prop({ required: true, ref: () => CurrencySchema, type: () => String })
  public currencyId!: string | Currency;

  @prop({ required: true })
  public amount!: number;
}

export class RewardItemSchema implements RewardItem {
  @prop({ required: true, ref: () => EquipmentSchema, type: () => Number })
  public itemId!: number | CommonItemsEquipmenParams;

  @prop({ required: true })
  public amount!: number;
}

export const RewardModel = getModelForClass(RewardSchema);
