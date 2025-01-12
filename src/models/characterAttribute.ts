import { Types } from 'mongoose';
import {
  CharacterAttributeMongooseSchema,
  AddedValue,
  AttributeName,
} from '../../../shared/src';
import {
  modelOptions,
  prop,
  getModelForClass,
  DocumentType,
} from '@typegoose/typegoose';
import { AttributeDetailSchema } from './attribute.model';

class AddedValueSchema implements Partial<AddedValue> {
  @prop({ default: 0 })
  equipment?: number;

  @prop({ default: 0 })
  otherAttributes?: number;
}

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'characters-attributes' },
})
export class CharacterAttributeSchema
  implements CharacterAttributeMongooseSchema
{
  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({
    required: true,
    // ref: () => AttributeDetailSchema,
    // type: () => String,
    // foreignField: 'attributeName',
    // localField: 'attributeName',
  })
  public attributeName!: AttributeName;

  @prop({ default: 0 })
  public baseValue?: number;

  @prop({
    default: { equipment: 0, otherAttributes: 0 },
    type: () => AddedValueSchema,
    _id: false,
  })
  public addedValue?: Partial<AddedValue>;

  @prop({
    default: function (this: DocumentType<CharacterAttributeSchema>) {
      return (
        (this.baseValue ?? 0) +
        (this.addedValue?.equipment ?? 0) +
        (this.addedValue?.otherAttributes ?? 0)
      );
    },
  })
  public totalValue?: number;
}

export const CharacterAttributeModel = getModelForClass(
  CharacterAttributeSchema
);
