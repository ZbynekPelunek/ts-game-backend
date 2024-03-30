import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Adventure, AdventureReward } from '../../../shared/src';
import { RewardSchema } from './reward.schema';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'adventures', allowMixed: Severity.ALLOW } })
export class AdventureSchema implements Adventure {
  @prop({ required: true })
  public adventureId!: number;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public level!: number;

  @prop({ required: true })
  public timeInSeconds!: number;

  @prop({ required: true, type: () => AdventureRewardSchema, _id: false })
  public rewards!: [ArraySubDocumentType<AdventureRewardSchema>, ...ArraySubDocumentType<AdventureRewardSchema>[]];

  @prop({ default: [] })
  public enemyIds?: number[];

  @prop()
  public requiredLevel?: number;
}

class AdventureRewardSchema implements AdventureReward {
  @prop({ required: true, ref: () => RewardSchema, type: () => Number })
  public rewardId!: number;

  @prop({ required: true })
  public amount!: number;
}

export const AdventureModel = getModelForClass(AdventureSchema);
