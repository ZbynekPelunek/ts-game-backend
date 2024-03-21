import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { InventoryItemBackend } from '../../../shared/src';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'inventory-items' } })
export class InventoryItemSchema implements InventoryItemBackend {
  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true })
  public slot!: number;

  @prop({ default: null })
  public itemId?: number;

  @prop({ default: 0 })
  public amount?: number;
}

export const InventoryItemModel = getModelForClass(InventoryItemSchema);
