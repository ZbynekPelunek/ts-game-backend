import { Severity, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { defaultMaxInventorySlots } from '../defaultCharacterData/inventory';
import { CharacterAttributeSchema } from './characterAttribute.schema';
import { CharacterCurrencySchema } from './characterCurrency.schema';
import { CharacterEquipmentSchema } from './characterEquipment.schema';
import { CharacterBackend, InventoryItemBackend } from '../../../shared/src';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'characters', allowMixed: Severity.ALLOW } })
export class CharacterSchema implements CharacterBackend {
  @prop({ requied: true })
  public accountId!: Types.ObjectId;

  @prop({ required: true })
  public name!: string;

  @prop({ default: [] })
  public adventures?: Types.ObjectId[];

  @prop({ default: [], ref: () => CharacterAttributeSchema })
  public characterAttributes?: Types.ObjectId[];

  @prop({ default: [], ref: () => CharacterCurrencySchema })
  public currencyIds?: Types.ObjectId[];

  @prop({ default: 0 })
  public currentExperience?: number;

  @prop({ default: [], ref: () => CharacterEquipmentSchema })
  public equipment?: Types.ObjectId[];

  @prop({ default: [] })
  public inventory?: InventoryItemBackend[];

  @prop({ default: 1 })
  public level?: number;

  @prop({ default: defaultMaxInventorySlots })
  public maxInventorySlot?: number;

  @prop({ default: 200 })
  public maxExperience?: number;
}

export const CharacterModel = getModelForClass(CharacterSchema);
