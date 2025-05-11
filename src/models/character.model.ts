import {
  Severity,
  getModelForClass,
  modelOptions,
  prop
} from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { defaultMaxInventorySlots } from '../defaultCharacterData/inventory';
import { Character, CharacterClass, CharacterRace } from '../../../shared/src';

export const CHARACTER_NAME_MIN_LENGTH = 3;
export const CHARACTER_NAME_MAX_LENGTH = 15;

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'characters', allowMixed: Severity.ALLOW }
})
export class CharacterSchema implements Character {
  @prop({ required: true })
  public accountId!: Types.ObjectId;

  @prop({
    required: true,
    unique: true,
    trim: true,
    minlength: [
      CHARACTER_NAME_MIN_LENGTH,
      `Character must have at least ${CHARACTER_NAME_MIN_LENGTH} letters!`
    ],
    maxlength: [
      CHARACTER_NAME_MAX_LENGTH,
      `Character cannot have more than ${CHARACTER_NAME_MAX_LENGTH} letters!`
    ]
  })
  public name!: string;

  @prop({ required: true })
  public characterClass!: CharacterClass;

  @prop({ required: true })
  public race!: CharacterRace;

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
