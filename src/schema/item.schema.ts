import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { ArmorType, EquipmentSlot, ItemAttribute, ItemQuality, ItemType, WeaponType, EquipmentItemBackend } from '../../../shared/src';

@modelOptions({ schemaOptions: { timestamps: true }, options: { customName: 'equipment-items' } })
export class EquipmentItemSchema implements EquipmentItemBackend {
  @prop({ required: true })
  public _id!: number;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, default: 1 })
  public sellValue!: number;

  @prop({ required: true, default: ItemQuality.COMMON })
  public quality!: ItemQuality;

  @prop({ required: true, default: 1 })
  public itemLevel!: number;

  @prop({ required: true })
  public attributes!: [ItemAttribute, ...ItemAttribute[]];

  @prop({ required: true })
  public itemType!: ItemType;

  @prop({ required: true })
  public slot!: EquipmentSlot;

  @prop({ required: true })
  public equipmentType!: ArmorType | WeaponType;

  @prop()
  public maxItemLevel?: number;

  @prop({ required: true, default: 1 })
  public levelReq!: number;

  @prop({ required: true, default: false })
  public isShopItem!: boolean;

  @prop({ required: true, default: 1 })
  public maxStack!: number;

  @prop()
  public icon?: string;
}

export const EquipmentItemModel = getModelForClass(EquipmentItemSchema);