import { ArraySubDocumentType, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { IRewardSchema, RewardCurrency, RewardItem } from '../../../shared/src';
import { CurrencySchema } from './currency.schema';
import { EquipmentSchema } from './item.schema';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'rewards' } })
export class RewardSchema implements IRewardSchema {
  @prop({ required: true, alias: 'rewardId' })
  public _id!: number;
  public rewardId!: number;

  @prop({ default: [], type: () => RewardCurrencySchema, _id: false })
  public currencies?: [ArraySubDocumentType<RewardCurrencySchema>, ...ArraySubDocumentType<RewardCurrencySchema>[]];

  @prop({ default: 0 })
  public experience?: number;

  @prop({ default: [], type: () => RewardItemSchema, _id: false })
  public items?: [ArraySubDocumentType<RewardItemSchema>, ...ArraySubDocumentType<RewardItemSchema>[]];
}

class RewardCurrencySchema implements RewardCurrency {
  @prop({ required: true, ref: () => CurrencySchema, type: () => Number })
  public currencyId!: number;

  @prop({ required: true })
  public amount!: number;
}

class RewardItemSchema implements RewardItem {
  @prop({ required: true, ref: () => EquipmentSchema, type: () => Number })
  public itemId!: number;

  @prop({ required: true })
  public amount!: number;
}

export const RewardModel = getModelForClass(RewardSchema);
