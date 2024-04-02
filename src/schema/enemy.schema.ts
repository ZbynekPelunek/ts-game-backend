import {
  ArraySubDocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';

import {
  AttributeName,
  Enemy,
  EnemyAttribute,
  EnemyTypes,
} from '../../../shared/src';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'enemies' },
})
export class EnemySchema implements Enemy {
  @prop({ required: true })
  public _id!: number;

  @prop({ required: true, default: 'PLACEHOLDER' })
  public name!: string;

  @prop({ required: true, enum: EnemyTypes })
  public type!: EnemyTypes;

  @prop({ required: true, default: [] })
  public attributes!: ArraySubDocumentType<EnemyAttributeSchema>[];
}

class EnemyAttributeSchema implements EnemyAttribute {
  @prop({ required: true })
  public attributeName!: AttributeName;

  @prop({ required: true })
  public value!: number;
}

export const EnemyModel = getModelForClass(EnemySchema);
