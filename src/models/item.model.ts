import {
  Severity,
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';

import {
  ArmorType,
  EquipmentSlot,
  ItemAttribute,
  ItemQuality,
  ItemType,
  WeaponType,
  CommonItemsEquipmenParams,
  CommonItemParams,
  CurrencyId,
} from '../../../shared/src';

@modelOptions({
  schemaOptions: { timestamps: true, discriminatorKey: 'itemType' },
  options: { allowMixed: Severity.ALLOW },
})
class ItemSchema implements CommonItemParams {
  @prop({ required: true })
  public itemId!: number;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, enum: ItemType })
  public itemType!: ItemType;

  @prop({ required: true })
  public sell!: {
    value: number;
    currencyId: CurrencyId;
  };

  @prop({ default: 1 })
  public maxAmount?: number;

  @prop({ enum: ItemQuality })
  public quality?: ItemQuality;

  @prop()
  public icon?: string;
}

export class EquipmentSchema
  extends ItemSchema
  implements CommonItemsEquipmenParams
{
  @prop({ required: true, default: 1 })
  public itemLevel!: number;

  @prop({ required: true })
  public attributes!: [ItemAttribute, ...ItemAttribute[]];

  @prop({ required: true, enum: EquipmentSlot })
  public slot!: EquipmentSlot;

  @prop({ required: true })
  public equipmentType!: ArmorType | WeaponType;

  @prop()
  public setId?: number;

  @prop()
  public maxItemLevel?: number;

  @prop({ default: 1 })
  public levelReq!: number;

  @prop({ default: false })
  public isShopItem!: boolean;
}

export const ItemModel = getModelForClass(ItemSchema);
export const ItemsEquipmentModel = getDiscriminatorModelForClass(
  ItemModel,
  EquipmentSchema,
  ItemType.EQUIPMENT
);
