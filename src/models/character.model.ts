import {
  Severity,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { defaultMaxInventorySlots } from '../defaultCharacterData/inventory';
import { CharacterBackend } from '../../../shared/src';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'characters', allowMixed: Severity.ALLOW },
})
export class CharacterSchema implements CharacterBackend {
  @prop({ required: true })
  public accountId!: Types.ObjectId;

  @prop({ required: true, unique: true })
  public name!: string;

  @prop({ default: [] })
  public adventures?: number[];

  @prop({ default: 0 })
  public currentExperience!: number;

  @prop({ default: 2 })
  public maxExperience!: number;

  @prop({ default: 1 })
  public level!: number;

  @prop({ default: defaultMaxInventorySlots })
  public maxInventorySlot?: number;
}

export const CharacterModel = getModelForClass(CharacterSchema);
