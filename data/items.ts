import { ArmorType, EquipableItem, EquipmentSlot, ItemQuality, ItemType, MainAttributeNames } from '../../shared/src';

const equipment: EquipableItem[] = [
  {
    itemLevel: 1,
    equipped: false,
    itemType: ItemType.EQUIPMENT,
    name: 'Starter Helm',
    levelReq: 1,
    maxStack: 1,
    quality: ItemQuality.COMMON,
    slot: EquipmentSlot.HEAD,
    sellValue: 1,
    shopItem: false,
    equipmentType: ArmorType.CLOTH,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeMaxValue: 5,
        attributeMinValue: 1
      }
    ]
  }
];