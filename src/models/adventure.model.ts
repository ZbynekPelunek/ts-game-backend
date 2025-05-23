import {
  getModelForClass,
  modelOptions,
  prop,
  Severity
} from '@typegoose/typegoose';
import {
  Adventure,
  AdventureReward,
  AdventureTypes,
  Reward
} from '../../../shared/src';
import { RewardSchema } from './reward.model';
import { EnemySchema } from './enemy.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'adventures', allowMixed: Severity.ALLOW }
})
export class AdventureSchema implements Adventure {
  @prop({ required: true })
  public _id!: number;

  @prop({ required: true, unique: true })
  public name!: string;

  @prop({ required: true })
  public adventureLevel!: number;

  @prop({ required: true })
  public timeInSeconds!: number;

  @prop({ required: true, enum: AdventureTypes })
  public type!: AdventureTypes;

  @prop({ required: true, type: () => AdventureRewardSchema, _id: false })
  public rewards!: [AdventureRewardSchema, ...AdventureRewardSchema[]];

  @prop({ default: [], ref: () => EnemySchema, type: () => Number })
  public enemyIds?: number[];

  @prop()
  public requiredLevel?: number;
}

export class AdventureRewardSchema implements AdventureReward {
  @prop({ required: true, ref: () => RewardSchema, type: () => Number })
  public rewardId!: number;

  @prop({ required: true })
  public amount!: number;
}

export const AdventureModel = getModelForClass(AdventureSchema);
