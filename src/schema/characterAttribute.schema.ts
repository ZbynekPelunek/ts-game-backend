import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { AttributeDetailSchema } from './attribute.schema';
import { CharacterAttributeBackend } from '../../../shared/src';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'character-attributes' },
})
export class CharacterAttributeSchema implements CharacterAttributeBackend {
  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true, ref: () => AttributeDetailSchema })
  public attributeId!: Types.ObjectId;

  @prop({ default: 0 })
  public baseValue!: number;

  @prop({ default: 0 })
  public addedValue!: number;

  @prop({ default: 0 })
  public statsAddedValue!: number;

  @prop({ default: 0 })
  public totalValue!: number;
}

export const CharacterAttributeModel = getModelForClass(
  CharacterAttributeSchema
);
