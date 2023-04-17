import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { CharacterAttributeBackend } from '../../../shared/src';
import { AttributeDetailSchema } from './attribute.schema';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'character-attributes' } })
export class CharacterAttributeSchema implements CharacterAttributeBackend {
  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true, ref: () => AttributeDetailSchema })
  public attributeId!: Types.ObjectId;

  @prop({ required: true, default: 0 })
  public baseValue!: number;

  @prop({ required: true, default: 0 })
  public addedValue!: number;

  @prop({ required: true, default: 0 })
  public statsAddedValue!: number;

  @prop({ required: true, default: 0 })
  public totalValue!: number;
}

export const CharacterAttributeModel = getModelForClass(CharacterAttributeSchema);
