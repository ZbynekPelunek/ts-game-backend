import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { InventoryBackend, InventoryItem } from '../../../shared/src';
import { ItemSchema } from './item.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'inventory' },
})
export class InventorySchema implements InventoryBackend {
  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true })
  public slot!: number;

  @prop({ default: null, type: () => InventoryItemSchema, _id: false })
  public item?: InventoryItem;

  @prop({ default: 0 })
  public amount?: number;
}

class InventoryItemSchema implements InventoryItem {
  @prop({ required: true, ref: () => ItemSchema, type: () => Number })
  public itemId!: number;

  @prop({ default: 0 })
  public amount!: number;
}

export const InventoryModel = getModelForClass(InventorySchema);
