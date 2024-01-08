import { Severity, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { CharacterBackend, InventoryItemBackend } from '../../../shared/src';
import { defaultMaxInventorySlots } from '../defaultCharacterData/inventory';
import { CharacterAttributeSchema } from './characterAttribute.schema';
import { CharacterCurrencySchema } from './characterCurrency.schema';
import { CharacterEquipmentSchema } from './equipmentItem.schema';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'characters', allowMixed: Severity.ALLOW } })
export class CharacterSchema implements CharacterBackend {
  @prop({ requied: true })
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

  @prop({ required: true, default: [], ref: () => CharacterEquipmentSchema })
  public equipment!: Types.ObjectId[];

  @prop({ required: true, default: [] })
  public inventory!: InventoryItemBackend[];

  @prop({ required: true, default: 1 })
  public level!: number;

  @prop({ required: true, default: defaultMaxInventorySlots })
  public maxInventorySlot!: number;

  @prop({ required: true, default: 200 })
  public maxExperience!: number;
}

export const CharacterModel = getModelForClass(CharacterSchema);
