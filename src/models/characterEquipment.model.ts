import {
  Severity,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';

import {
  CharacterEquipmentBackend,
  CharacterEquipmentItem,
  EquipmentSlot,
  UiPosition,
} from '../../../shared/src';
import { EquipmentSchema } from './item.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    customName: 'character-equipment-items',
    allowMixed: Severity.ALLOW,
  },
})
export class CharacterEquipmentSchema implements CharacterEquipmentBackend {
  @prop({ required: true })
  public slot!: EquipmentSlot;

  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true })
  public uiPosition!: UiPosition;

  @prop({ default: null, type: () => CharacterEquipmentItemSchema, _id: false })
  item?: CharacterEquipmentItem | null;
}

class CharacterEquipmentItemSchema implements CharacterEquipmentItemSchema {
  @prop({ required: true, ref: () => EquipmentSchema })
  public itemId!: number;
}

export const CharacterEquipmentModel = getModelForClass(
  CharacterEquipmentSchema
);
