import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { CharacterEquipmentBackend, EquipmentSlot, UiPostition } from '../../../shared/src';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'character-equipment-items' } })
export class CharacterEquipmentSchema implements CharacterEquipmentBackend {
  @prop({ required: true })
  public _id!: EquipmentSlot;

  @prop({ required: true })
  public characterId!: Types.ObjectId;

  @prop({ required: true })
  public itemId!: Types.ObjectId;

  @prop({ required: true })
  public uiPosition!: UiPostition;
}

export const CharacterEquipmentModel = getModelForClass(CharacterEquipmentSchema);