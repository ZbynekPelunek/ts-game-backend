import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { IRewardSchema } from '../../../shared/src';
import { CurrencySchema } from './currency.schema';
import { EquipmentSchema } from './item.schema';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'rewards' } })
export class RewardSchema implements IRewardSchema {
  @prop({ required: true, alias: 'rewardId' })
  public _id!: number;
  public rewardId!: number;

  @prop({ default: [], ref: () => CurrencySchema, type: () => Number })
  public currencies?: [number, ...number[]];

  @prop({ default: 0 })
  public experience?: number;

  @prop({ default: [], ref: () => EquipmentSchema, type: () => Number })
  public items?: [number, ...number[]];
}

export const RewardModel = getModelForClass(RewardSchema);
