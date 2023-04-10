import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { AttributeNames, BasicAttribute } from '../../../shared/src';

@modelOptions({ schemaOptions: { timestamps: true } })
class AttributeDetail implements BasicAttribute {
  @prop({ required: true })
  public attributeName!: AttributeNames;

  @prop({ required: true })
  public label!: string;

  @prop({ required: true, default: false })
  public isPercent!: boolean;

  @prop()
  public desc?: string;
}

export const AttributeDetailModel = getModelForClass(AttributeDetail);