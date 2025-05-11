import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Attribute, AttributeName } from '../../../shared/src';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'attribute-details' }
})
export class AttributeSchema implements Attribute {
  @prop({ required: true })
  public attributeName!: AttributeName;

  @prop({ required: true })
  public label!: string;

  @prop({ required: true, default: false })
  public isPercent!: boolean;

  @prop()
  public desc?: string;
}

export const AttributeModel = getModelForClass(AttributeSchema);
