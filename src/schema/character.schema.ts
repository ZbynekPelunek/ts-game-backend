import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { CharacterBackend } from '../../../shared/src';
import { defaultMaxInventorySlots } from '../defaultCharacterData/inventory';
import { AccountSchema } from './account.schema';
import { CharacterAttributeSchema } from './characterAttribute.schema';
import { CharacterCurrencySchema } from './characterCurrency.schema';
import { InventoryItemSchema } from './inventoryItem.schema';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'characters' } })
export class CharacterSchema implements CharacterBackend {
  @prop({ requied: true, ref: () => AccountSchema })
  public accountId!: Types.ObjectId;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, default: [] })
  public adventures!: Types.ObjectId[];

  @prop({ required: true, default: [], ref: () => CharacterAttributeSchema })
  public characterAttributes!: Types.ObjectId[];

  @prop({ required: true, default: [], ref: () => CharacterCurrencySchema })
  public currencyIds!: Types.ObjectId[];

  @prop({ required: true, default: 0 })
  public currentExperience!: number;

  @prop({ required: true, default: [] })
  public equipment!: Types.ObjectId[];

  @prop({ required: true, default: [], ref: () => InventoryItemSchema })
  public inventory!: Types.ObjectId[];

  @prop({ required: true, default: 1 })
  public level!: number;

  @prop({ required: true, default: defaultMaxInventorySlots })
  public maxInventorySlot!: number;

  @prop({ required: true, default: 200 })
  public maxExperience!: number;
}

export const CharacterModel = getModelForClass(CharacterSchema);
