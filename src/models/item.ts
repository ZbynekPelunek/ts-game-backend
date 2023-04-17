

// export class Item {
//   static createArmor(armor: IArmor): IArmor {
//     return {
//       itemId: armor.itemId,
//       itemLevel: armor.itemLevel || 1,
//       name: armor.name,
//       quality: armor.quality || ItemQuality.COMMON,
//       sellValue: armor.sellValue || '1',
//       itemType: armor.itemType,
//       slot: armor.slot,
//       armorType: armor.armorType,
//       levelReq: armor.levelReq || 1,
//       equipped: armor.equipped || false,
//       Armor: armor.Armor | 1,
//       statsEffects: armor.statsEffects
//     }
//   }

//   static createWeapon(weapon: IWeapon): IWeapon {
//     return {
//       itemId: weapon.itemId,
//       itemLevel: weapon.itemLevel || 1,
//       name: weapon.name,
//       quality: weapon.quality || ItemQuality.COMMON,
//       itemType: weapon.itemType,
//       slot: weapon.slot,
//       weaponType: weapon.weaponType,
//       equipped: weapon.equipped || false,
//       sellValue: weapon.sellValue || '1',
//       Min_Damage: weapon.Min_Damage || 0,
//       Max_Damage: weapon.Max_Damage || 0,
//       statsEffects: weapon.statsEffects
//     }
//   }

//   static createPotion(potion: IPotion): IPotion {
//     return {
//       itemId: potion.itemId,
//       itemLevel: potion.itemLevel || 1,
//       name: potion.name,
//       quality: potion.quality || ItemQuality.COMMON,
//       itemType: potion.itemType,
//       stats: potion.stats,
//       maxStack: potion.maxStack,
//       equipped: potion.equipped,
//       sellValue: potion.sellValue || '1',
//     }
//   }
// }