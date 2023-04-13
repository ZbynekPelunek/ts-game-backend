import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { CharacterBackend } from '../../../shared/src';
import { defaultMaxInventorySlots } from '../defaultCharacterData/inventory';
import { InventoryItem } from './inventory.schema';

@modelOptions({ schemaOptions: { timestamps: true } })
class Character implements CharacterBackend {
  @prop({ requied: true })
  public accountId!: Types.ObjectId;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, default: [] })
  public adventures!: Types.ObjectId[];

  @prop({ required: true, default: [] })
  public characterAttributes!: Types.ObjectId[];

  @prop({ required: true, default: [] })
  public currencies!: Types.ObjectId[];

  @prop({ required: true, default: 0 })
  public currentExperience!: number;

  @prop({ required: true, default: [] })
  public equipment!: Types.ObjectId[];

  @prop({ required: true, default: [], ref: () => InventoryItem })
  public inventory!: Types.ObjectId[];

  @prop({ required: true, default: 1 })
  public level!: number;

  @prop({ required: true, default: defaultMaxInventorySlots })
  public maxInventorySlot!: number;

  @prop({ required: true, default: 200 })
  public maxExperience!: number;

  // @prop({ required: true, default: [], ref: () => InventoryItem })
  // public inventoryItems?: Ref<InventoryItem>[];
}

export const CharacterModel = getModelForClass(Character);
