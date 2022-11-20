import {
  ArmorType,
  EquipableItem,
  EquipmentSlot,
  InventoryItem,
  ItemQuality,
  ItemType,
  StatName,
  WeaponType,
} from '../../../shared/src';
import { Item } from '../models/item';

export const testEquipmentArr: EquipableItem[] = [
  Item.createArmor(
    {
      equipped: false,
      itemId: '1',
      name: 'Test Leather',
      itemLevel: 1,
      quality: ItemQuality.COMMON,
      sellValue: '1',
      itemType: ItemType.EQUIPMENT,
      armorType: ArmorType.LEATHER,
      slot: EquipmentSlot.ARMOR,
      statsEffects: {
        default: [{
          statName: StatName.HEALTH,
          statValue: 10
        }],
        rolledAffixes: []
      },
      Armor: 100
    }),
  Item.createWeapon({
    equipped: false,
    itemId: '2',
    name: 'Test Weapon Axe 1',
    itemLevel: 1,
    quality: ItemQuality.COMMON,
    sellValue: '1',
    itemType: ItemType.EQUIPMENT,
    weaponType: WeaponType.AXE,
    slot: EquipmentSlot.WEAPON,
    statsEffects: {
      default: [{
        statName: StatName.HEALTH,
        statValue: 10
      }],
      rolledAffixes: []
    },
    Min_Damage: 1,
    Max_Damage: 2
  }),
  Item.createArmor({
    equipped: false,
    name: 'Test Cloth',
    itemId: '3',
    sellValue: '5',
    itemLevel: 1,
    quality: ItemQuality.COMMON,
    itemType: ItemType.EQUIPMENT,
    armorType: ArmorType.CLOTH,
    slot: EquipmentSlot.ARMOR,
    statsEffects: {
      default: [{
        statName: StatName.HEALTH,
        statValue: 10
      }],
      rolledAffixes: []
    },
    Armor: 50
  }),
  Item.createArmor({
    equipped: false,
    name: 'Test Plate',
    itemId: '4',
    sellValue: '5',
    itemLevel: 1,
    quality: ItemQuality.COMMON,
    itemType: ItemType.EQUIPMENT,
    armorType: ArmorType.PLATE,
    slot: EquipmentSlot.ARMOR,
    statsEffects: {
      default: [{
        statName: StatName.HEALTH,
        statValue: 10
      }],
      rolledAffixes: []
    },
    Armor: 260
  }),
  Item.createArmor({
    equipped: false,
    name: 'Test Crazy Plate Armor',
    itemId: '5',
    sellValue: '5',
    itemLevel: 1,
    quality: ItemQuality.LEGENDARY,
    itemType: ItemType.EQUIPMENT,
    armorType: ArmorType.PLATE,
    slot: EquipmentSlot.ARMOR,
    statsEffects: {
      default: [
        {
          statName: StatName.HEALTH,
          statValue: 10
        },
        {
          statName: StatName.AGILITY,
          statValue: 10
        },
        {
          statName: StatName.CRIT_CHANCE_RATING,
          statValue: 36
        },
        {
          statName: StatName.PERCENT_DAMAGE,
          statValue: 456
        },
        {
          statName: StatName.PERCENT_CRIT_DAMAGE,
          statValue: 10
        },
        {
          statName: StatName.PERCENT_CRIT_CHANCE,
          statValue: 8.3
        },
        {
          statName: StatName.INTELLECT,
          statValue: 129
        },
        {
          statName: StatName.STAMINA,
          statValue: 654
        }
      ],
      rolledAffixes: [
        {
          statName: StatName.HEALTH,
          statValue: 17
        },
        {
          statName: StatName.AGILITY,
          statValue: 104
        },
        {
          statName: StatName.CRIT_CHANCE_RATING,
          statValue: 96
        },
        {
          statName: StatName.PERCENT_DAMAGE,
          statValue: 46
        },
        {
          statName: StatName.PERCENT_CRIT_DAMAGE,
          statValue: 101
        },
        {
          statName: StatName.PERCENT_CRIT_CHANCE,
          statValue: 78.3
        },
        {
          statName: StatName.INTELLECT,
          statValue: 629
        },
        {
          statName: StatName.STAMINA,
          statValue: 2547
        }
      ]
    },
    Armor: 260
  }),
  Item.createWeapon({
    equipped: false,
    positionIndex: 1,
    name: 'Test Weapon 2',
    itemId: '6',
    itemLevel: 1,
    quality: ItemQuality.COMMON,
    sellValue: '5',
    itemType: ItemType.EQUIPMENT,
    weaponType: WeaponType.BOW,
    slot: EquipmentSlot.WEAPON,
    statsEffects: {
      default: [{
        statName: StatName.HEALTH,
        statValue: 10
      }],
      rolledAffixes: []
    },
    Min_Damage: 4,
    Max_Damage: 9
  })
];

export const testInventoryItemsArr: InventoryItem[] = [
  Item.createPotion({
    equipped: false,
    itemId: '333',
    name: 'Test Potion',
    itemLevel: 1,
    maxStack: 3,
    quality: ItemQuality.COMMON,
    itemType: ItemType.POTION,
    sellValue: '1',
    stats: [
      { statName: StatName.HEALTH, statValue: 50 }
    ]
  })
]