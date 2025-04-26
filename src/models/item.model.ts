import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop
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
  AttributeName,
  CurrencyId
} from '../../../shared/src';

@modelOptions({
  schemaOptions: { timestamps: true, discriminatorKey: 'itemType' }
})
export class ItemSchema implements CommonItemParams {
  @prop()
  public icon!: string;

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

  @prop({ enum: ItemQuality, default: ItemQuality.COMMON })
  public quality?: ItemQuality;
}

export class EquipmentSchema
  extends ItemSchema
  implements CommonItemsEquipmenParams
{
  @prop({ required: true, default: 1 })
  public itemLevel!: number;

  @prop({ required: true, type: () => [ItemAttributeSchema] })
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

class ItemAttributeSchema implements ItemAttribute {
  @prop({ required: true })
  public attributeName!: AttributeName;

  @prop({ required: true })
  public attributeValue!: number;

  @prop({ required: true, enum: ItemQuality })
  public requiredQuality?: ItemQuality;
}

// to make customName work with discriminator, it needs to be set here
export const ItemModel = getModelForClass(ItemSchema, {
  options: { customName: 'items' }
});
export const EquipmentModel = getDiscriminatorModelForClass(
  ItemModel,
  EquipmentSchema,
  ItemType.EQUIPMENT
);
