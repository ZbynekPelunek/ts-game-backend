import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { BasicAttribute } from '../../../shared/src';

@modelOptions({ schemaOptions: { timestamps: true } })
class Attributes implements BasicAttribute {
  @prop({ required: true })
  public attributeId!: string;

  @prop({ required: true })
  public label!: string;

  @prop()
  public desc?: string;

  @prop({ required: true })
  public type!: string;

  @prop({ default: false })
  public percent?: boolean;
}

export const AttributeModel = getModelForClass(Attributes);