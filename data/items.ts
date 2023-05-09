import { EquipmentSlot, ItemQuality, ItemType, MainAttributeNames, ArmorType, Armor, PrimaryAttributeName, SecondaryAttributeName, Weapon, WeaponType } from '../../shared/src';

const commonStarterArmorParams = {
  itemLevel: 1,
  itemType: ItemType.EQUIPMENT,
  sellValue: 1,
  maxItemLevel: 5
}

const starterArmor: Armor[] = [
  {
    ...commonStarterArmorParams,
    _id: 1,
    setId: 1,
    name: 'Loosely Threaded Hat',
    slot: EquipmentSlot.HEAD,
    equipmentType: ArmorType.CLOTH,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeMaxValue: 9,
        attributeMinValue: 5,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.INTELLECT,
        attributeMaxValue: 5,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.STAMINA,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_CHANCE_RATING,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_DAMAGE_RATING,
        attributeMaxValue: 2,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeName.MULTISTRIKE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  },
  {
    ...commonStarterArmorParams,
    _id: 2,
    setId: 1,
    name: 'Loosely Threaded Shoulderpads',
    slot: EquipmentSlot.SHOULDER,
    equipmentType: ArmorType.CLOTH,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeMaxValue: 7,
        attributeMinValue: 4,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.INTELLECT,
        attributeMaxValue: 4,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.STAMINA,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_CHANCE_RATING,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_DAMAGE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      }
    ]
  },
  {
    ...commonStarterArmorParams,
    _id: 3,
    setId: 1,
    name: 'Loosely Threaded Robe',
    slot: EquipmentSlot.CHEST,
    equipmentType: ArmorType.CLOTH,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeMaxValue: 11,
        attributeMinValue: 5,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.INTELLECT,
        attributeMaxValue: 6,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.STAMINA,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_CHANCE_RATING,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_DAMAGE_RATING,
        attributeMaxValue: 2,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeName.MULTISTRIKE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  },
  {
    ...commonStarterArmorParams,
    _id: 4,
    setId: 1,
    name: 'Loosely Threaded Gloves',
    slot: EquipmentSlot.HANDS,
    equipmentType: ArmorType.CLOTH,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeMaxValue: 8,
        attributeMinValue: 4,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.INTELLECT,
        attributeMaxValue: 4,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.STAMINA,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_CHANCE_RATING,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_DAMAGE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      }
    ]
  },
  {
    ...commonStarterArmorParams,
    _id: 5,
    setId: 1,
    name: 'Loosely Threaded Pants',
    slot: EquipmentSlot.HANDS,
    equipmentType: ArmorType.CLOTH,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeMaxValue: 10,
        attributeMinValue: 5,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.INTELLECT,
        attributeMaxValue: 4,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.STAMINA,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_CHANCE_RATING,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_DAMAGE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      }
    ]
  },
  {
    ...commonStarterArmorParams,
    _id: 5,
    setId: 1,
    name: 'Loosely Threaded Shield',
    slot: EquipmentSlot.OFF_HAND,
    equipmentType: ArmorType.SHIELD,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeMaxValue: 10,
        attributeMinValue: 5,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.INTELLECT,
        attributeMaxValue: 4,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.STAMINA,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_CHANCE_RATING,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_DAMAGE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      }
    ]
  }
];

const commonStarterWeaponParams = {
  itemLevel: 1,
  itemType: ItemType.EQUIPMENT,
  sellValue: 1,
  maxItemLevel: 5
}

const starterWeapons: Weapon[] = [
  {
    ...commonStarterWeaponParams,
    _id: 10,
    setId: 2,
    name: 'Worn Hatchet',
    slot: EquipmentSlot.ONE_HAND,
    equipmentType: WeaponType.AXE_1HAND,
    attributes: [
      {
        attributeName: MainAttributeNames.MIN_DAMAGE,
        attributeMaxValue: 4,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: MainAttributeNames.MAX_DAMAGE,
        attributeMaxValue: 8,
        attributeMinValue: 4,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.AGILITY,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.STRENGTH,
        attributeMaxValue: 5,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.STAMINA,
        attributeMaxValue: 2,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_CHANCE_RATING,
        attributeMaxValue: 5,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeName.CRIT_DAMAGE_RATING,
        attributeMaxValue: 2,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  },
  {
    ...commonStarterWeaponParams,
    _id: 11,
    setId: 2,
    name: 'Worn Cleaver',
    slot: EquipmentSlot.ONE_HAND,
    equipmentType: WeaponType.AXE_2HAND,
    attributes: [
      {
        attributeName: MainAttributeNames.MIN_DAMAGE,
        attributeMaxValue: 7,
        attributeMinValue: 3,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: MainAttributeNames.MAX_DAMAGE,
        attributeMaxValue: 15,
        attributeMinValue: 7,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.AGILITY,
        attributeMaxValue: 6,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.STRENGTH,
        attributeMaxValue: 10,
        attributeMinValue: 5,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeName.STAMINA,
        attributeMaxValue: 5,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeName.CRIT_CHANCE_RATING,
        attributeMaxValue: 10,
        attributeMinValue: 6,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeName.CRIT_DAMAGE_RATING,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  }
  /*
  / MISSING:
  / sword 1h, sword 2h, wand, staff
  */
]
