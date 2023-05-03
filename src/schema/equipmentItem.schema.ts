import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { EquipmentItemBackend, EquipmentSlot, UiPostition } from '../../../shared/src';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'equipment-items' } })
export class EquipmentItemSchema implements EquipmentItemBackend {
  @prop({ required: true })
  public _id!: EquipmentSlot;

  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true })
  public itemId!: Types.ObjectId;

  @prop({ required: true })
  public uiPosition!: UiPostition;
}

export const EquipmentItemModel = getModelForClass(EquipmentItemSchema);