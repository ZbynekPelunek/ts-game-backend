import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { InventoryBackend } from '../../../shared/src';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'inventory' },
})
export class InventorySchema implements InventoryBackend {
  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true })
  public slot!: number;

  @prop({ default: null })
  public itemId?: number;

  @prop({ default: 0 })
  public amount?: number;
}

export const InventoryModel = getModelForClass(InventorySchema);
