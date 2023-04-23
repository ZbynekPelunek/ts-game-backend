import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { InventoryItemBackend } from '../../../shared/src';

enum EquipmentSlot {
  CHEST,
  WEAPON
}

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'equipment-items' } })
export class EquipmentItemSchema {
  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true })
  public itemId!: Types.ObjectId;

  @prop({ required: true })
  public equipmentSlot!: EquipmentSlot;
}

export const EquipmentItemModel = getModelForClass(EquipmentItemSchema);