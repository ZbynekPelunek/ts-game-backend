import {
  Severity,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';

import {
  CharacterEquipmentBackend,
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

  @prop({ default: null, ref: () => EquipmentSchema, type: () => Number })
  public itemId!: number | null;
}

export const CharacterEquipmentModel = getModelForClass(
  CharacterEquipmentSchema
);
