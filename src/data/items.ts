import {
  EquipmentSlot,
  ItemQuality,
  ItemType,
  MainAttributeNames,
  ArmorType,
  Armor,
  PrimaryAttributeNames,
  SecondaryAttributeNames,
  Weapon,
  WeaponType,
  CurrencyId,
} from '../../../shared/src';
import { getBase64FromImage } from '../engine/imageConvertor';

const defaultImagePath = './src/images/noImageDefault.png';

const commonStarterArmorParams = {
  icon: getBase64FromImage(defaultImagePath) ?? '',
  itemLevel: 1,
  itemType: ItemType.EQUIPMENT,
  maxItemLevel: 5,
  maxAmount: 1,
  sell: {
    currencyId: CurrencyId.GOLD,
    value: 1,
  },
};

const commonStarterWeaponParams = {
  icon: getBase64FromImage(defaultImagePath) ?? '',
  itemLevel: 1,
  itemType: ItemType.EQUIPMENT,
  maxItemLevel: 5,
  maxAmount: 1,
  sell: {
    currencyId: CurrencyId.GOLD,
    value: 1,
  },
};

export const starterArmor: Armor[] = [
  {
    ...commonStarterArmorParams,
    itemId: 1,
    setId: 1,
    name: 'Loosely Threaded Chest',
    slot: EquipmentSlot.CHEST,
    equipmentType: ArmorType.CLOTH,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeValue: 9,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeValue: 5,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 4,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 4,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 2,
        requiredQuality: ItemQuality.RARE,
      },
      {
        attributeName: SecondaryAttributeNames.MULTISTRIKE_RATING,
        attributeValue: 1,
        requiredQuality: ItemQuality.EPIC,
      },
    ],
  },
  {
    ...commonStarterArmorParams,
    itemId: 2,
    setId: 1,
    name: 'Loosely Threaded Chest 2',
    slot: EquipmentSlot.CHEST,
    equipmentType: ArmorType.CLOTH,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeValue: 7,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeValue: 4,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 3,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 3,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 1,
        requiredQuality: ItemQuality.RARE,
      },
    ],
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
        attributeValue: 11,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeValue: 6,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 4,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 4,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 2,
        requiredQuality: ItemQuality.RARE,
      },
      {
        attributeName: SecondaryAttributeNames.MULTISTRIKE_RATING,
        attributeValue: 1,
        requiredQuality: ItemQuality.EPIC,
      },
    ],
  },
  {
    ...commonStarterArmorParams,
    itemId: 4,
    setId: 1,
    name: 'Loosely Threaded Legs',
    slot: EquipmentSlot.LEGS,
    equipmentType: ArmorType.CLOTH,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeValue: 8,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeValue: 4,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 3,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 3,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 1,
        requiredQuality: ItemQuality.RARE,
      },
    ],
  },
  {
    ...commonStarterArmorParams,
    itemId: 5,
    setId: 1,
    name: 'Loosely Threaded Pants',
    slot: EquipmentSlot.LEGS,
    equipmentType: ArmorType.CLOTH,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeValue: 10,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeValue: 4,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 3,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 3,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 1,
        requiredQuality: ItemQuality.RARE,
      },
    ],
  },
  {
    ...commonStarterArmorParams,
    itemId: 6,
    setId: 1,
    name: 'Loosely Threaded Legs 2',
    slot: EquipmentSlot.LEGS,
    equipmentType: ArmorType.SHIELD,
    attributes: [
      {
        attributeName: MainAttributeNames.ARMOR,
        attributeValue: 10,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.INTELLECT,
        attributeValue: 4,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 3,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 3,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 1,
        requiredQuality: ItemQuality.RARE,
      },
    ],
  },
];

export const starterWeapons: Weapon[] = [
  {
    ...commonStarterWeaponParams,
    itemId: 10,
    setId: 2,
    name: 'Worn Hatchet',
    slot: EquipmentSlot.MAIN_HAND,
    equipmentType: WeaponType.AXE_1HAND,
    attributes: [
      {
        attributeName: MainAttributeNames.MIN_DAMAGE,
        attributeValue: 4,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: MainAttributeNames.MAX_DAMAGE,
        attributeValue: 8,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeValue: 3,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeValue: 5,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 2,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 5,
        requiredQuality: ItemQuality.RARE,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 2,
        requiredQuality: ItemQuality.EPIC,
      },
    ],
  },
  {
    ...commonStarterWeaponParams,
    itemId: 11,
    setId: 2,
    name: 'Worn Cleaver',
    slot: EquipmentSlot.MAIN_HAND,
    equipmentType: WeaponType.AXE_2HAND,
    attributes: [
      {
        attributeName: MainAttributeNames.MIN_DAMAGE,
        attributeValue: 7,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: MainAttributeNames.MAX_DAMAGE,
        attributeValue: 15,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeValue: 6,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeValue: 10,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 5,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 10,
        requiredQuality: ItemQuality.RARE,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 4,
        requiredQuality: ItemQuality.EPIC,
      },
    ],
  },
  {
    ...commonStarterWeaponParams,
    itemId: 12,
    setId: 2,
    name: 'Worn Blade',
    slot: EquipmentSlot.MAIN_HAND,
    equipmentType: WeaponType.SWORD_1HAND,
    attributes: [
      {
        attributeName: MainAttributeNames.MIN_DAMAGE,
        attributeValue: 7,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: MainAttributeNames.MAX_DAMAGE,
        attributeValue: 15,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeValue: 6,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeValue: 10,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 5,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 10,
        requiredQuality: ItemQuality.RARE,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 4,
        requiredQuality: ItemQuality.EPIC,
      },
    ],
  },
  {
    ...commonStarterWeaponParams,
    itemId: 13,
    setId: 2,
    name: 'Worn Greatsword',
    slot: EquipmentSlot.MAIN_HAND,
    equipmentType: WeaponType.SWORD_2HAND,
    attributes: [
      {
        attributeName: MainAttributeNames.MIN_DAMAGE,
        attributeValue: 7,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: MainAttributeNames.MAX_DAMAGE,
        attributeValue: 15,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeValue: 6,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeValue: 10,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 5,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 10,
        requiredQuality: ItemQuality.RARE,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 4,
        requiredQuality: ItemQuality.EPIC,
      },
    ],
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
        attributeValue: 7,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: MainAttributeNames.MAX_DAMAGE,
        attributeValue: 15,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeValue: 6,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeValue: 10,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 5,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 10,
        requiredQuality: ItemQuality.RARE,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 4,
        requiredQuality: ItemQuality.EPIC,
      },
    ],
  },
  {
    ...commonStarterWeaponParams,
    itemId: 15,
    setId: 2,
    name: 'Worn Quarterstaff',
    slot: EquipmentSlot.MAIN_HAND,
    equipmentType: WeaponType.STAFF,
    attributes: [
      {
        attributeName: MainAttributeNames.MIN_DAMAGE,
        attributeValue: 7,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: MainAttributeNames.MAX_DAMAGE,
        attributeValue: 15,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.AGILITY,
        attributeValue: 6,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STRENGTH,
        attributeValue: 10,
        requiredQuality: ItemQuality.COMMON,
      },
      {
        attributeName: PrimaryAttributeNames.STAMINA,
        attributeValue: 5,
        requiredQuality: ItemQuality.UNCOMMON,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_CHANCE_RATING,
        attributeValue: 10,
        requiredQuality: ItemQuality.RARE,
      },
      {
        attributeName: SecondaryAttributeNames.CRIT_DAMAGE_RATING,
        attributeValue: 4,
        requiredQuality: ItemQuality.EPIC,
      },
    ],
  },
];
