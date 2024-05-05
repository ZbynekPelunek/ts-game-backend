import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { ResultBackend, ResultCombat } from '../../../shared/src';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'results' },
})
export class ResultSchema implements ResultBackend {
  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true })
  public adventureId!: number;

  @prop({ type: () => ResultCombatSchema, _id: false })
  public combat?: ResultCombat | null;

  @prop({ required: true })
  public timeFinish!: string;

  @prop({ required: true })
  public timeStart!: string;
}

class ResultCombatSchema implements ResultCombat {
  @prop({ required: true })
  public log!: string;

  @prop({ required: true })
  public playerWon!: boolean;
}

export const ResultModel = getModelForClass(ResultSchema);
