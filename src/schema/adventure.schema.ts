import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Adventure } from '../../../shared/src';
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

  @prop({ required: true, ref: () => RewardSchema, type: () => Number })
  public reward!: [number, ...number[]];

  @prop()
  public enemyId?: number[];

  @prop()
  public requiredLevel?: number;
}

export const AdventureModel = getModelForClass(AdventureSchema);
