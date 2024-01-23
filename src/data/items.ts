import { EquipmentSlot, ItemQuality, ItemType, MainAttributeNames, ArmorType, Armor, PrimaryAttributeNames, SecondaryAttributeNames, Weapon, WeaponType } from '../../../shared/src';

const commonStarterArmorParams = {
  itemLevel: 1,
  itemType: ItemType.EQUIPMENT,
  sellValue: 1,
  maxItemLevel: 5,
  maxAmount: 1
}

export const starterArmor: Armor[] = [
  {
    ...commonStarterArmorParams,
    itemId: 1,
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
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeMaxValue: 5,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 2,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeNames.MULTISTRIKE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  },
  {
    ...commonStarterArmorParams,
    itemId: 2,
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
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeMaxValue: 4,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      }
    ]
  },
  {
    ...commonStarterArmorParams,
    itemId: 3,
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
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeMaxValue: 6,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 2,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeNames.MULTISTRIKE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  },
  {
    ...commonStarterArmorParams,
    itemId: 4,
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
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeMaxValue: 4,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      }
    ]
  },
  {
    ...commonStarterArmorParams,
    itemId: 5,
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
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeMaxValue: 4,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 1,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.RARE
      }
    ]
  },
  {
    ...commonStarterArmorParams,
    itemId: 6,
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
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeMaxValue: 4,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
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
  maxItemLevel: 5,
  maxAmount: 1
}

export const starterWeapons: Weapon[] = [
  {
    ...commonStarterWeaponParams,
    itemId: 10,
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
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeMaxValue: 3,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeMaxValue: 5,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 2,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 5,
        attributeMinValue: 1,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 2,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  },
  {
    ...commonStarterWeaponParams,
    itemId: 11,
    setId: 2,
    name: 'Worn Cleaver',
    slot: EquipmentSlot.TWO_HAND,
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
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeMaxValue: 6,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeMaxValue: 10,
        attributeMinValue: 5,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 5,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 10,
        attributeMinValue: 6,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  },
  {
    ...commonStarterWeaponParams,
    itemId: 12,
    setId: 2,
    name: 'Worn Blade',
    slot: EquipmentSlot.ONE_HAND,
    equipmentType: WeaponType.SWORD_1HAND,
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
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeMaxValue: 6,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeMaxValue: 10,
        attributeMinValue: 5,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 5,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 10,
        attributeMinValue: 6,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  },
  {
    ...commonStarterWeaponParams,
    itemId: 13,
    setId: 2,
    name: 'Worn Greatsword',
    slot: EquipmentSlot.TWO_HAND,
    equipmentType: WeaponType.SWORD_2HAND,
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
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeMaxValue: 6,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeMaxValue: 10,
        attributeMinValue: 5,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 5,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 10,
        attributeMinValue: 6,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  },
  {
    ...commonStarterWeaponParams,
    itemId: 14,
    setId: 2,
    name: 'Worn Scepter',
    slot: EquipmentSlot.MAIN_HAND,
    equipmentType: WeaponType.WAND,
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
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeMaxValue: 6,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeMaxValue: 10,
        attributeMinValue: 5,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 5,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 10,
        attributeMinValue: 6,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  },
  {
    ...commonStarterWeaponParams,
    itemId: 15,
    setId: 2,
    name: 'Worn Quarterstaff',
    slot: EquipmentSlot.TWO_HAND,
    equipmentType: WeaponType.STAFF,
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
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeMaxValue: 6,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeMaxValue: 10,
        attributeMinValue: 5,
        requiredQuality: ItemQuality.COMMON
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeMaxValue: 5,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.UNCOMMON
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeMaxValue: 10,
        attributeMinValue: 6,
        requiredQuality: ItemQuality.RARE
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeMaxValue: 4,
        attributeMinValue: 0,
        requiredQuality: ItemQuality.EPIC
      }
    ]
  }
]
