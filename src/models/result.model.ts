import {
  modelOptions,
  prop,
  getModelForClass,
  ArraySubDocumentType
} from '@typegoose/typegoose';
import { Types } from 'mongoose';

import {
  ResultBackend,
  ResultCombat,
  ResultReward,
  ResultState
} from '../../../shared/src';
import { RewardCurrencySchema, RewardItemSchema } from './rewardModel';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'results' }
})
export class ResultSchema implements ResultBackend {
  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true })
  public adventureId!: number;

  @prop({ required: true })
  public adventureName!: string;

  @prop({ required: true })
  public timeFinish!: string;

  @prop({ required: true })
  public timeStart!: string;

  @prop({ required: true })
  public state!: ResultState;

  @prop({ required: true, type: () => ResultRewardSchema, _id: false })
  public reward!: ResultReward;

  @prop({ type: () => ResultCombatSchema, _id: false })
  public combat?: ResultCombat | null;
}

class ResultCombatSchema implements ResultCombat {
  @prop({ required: true })
  public log!: string;

  @prop({ required: true })
  public playerWon!: boolean;
}

class ResultRewardSchema implements ResultReward {
  @prop({
    required: true,
    default: [],
    type: () => RewardCurrencySchema,
    _id: false
  })
  public currencies!: [
    ArraySubDocumentType<RewardCurrencySchema>,
    ...ArraySubDocumentType<RewardCurrencySchema>[]
  ];

  @prop({ required: true, default: 0 })
  public experience!: number;

  @prop({
    required: true,
    default: [],
    type: () => RewardItemSchema,
    _id: false
  })
  public items!: [
    ArraySubDocumentType<RewardItemSchema>,
    ...ArraySubDocumentType<RewardItemSchema>[]
  ];
}

export const ResultModel = getModelForClass(ResultSchema);
