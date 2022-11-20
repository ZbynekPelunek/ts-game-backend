import { CharacterStats, StatName, StatType } from '../../../shared/src';

export const defaultStats: CharacterStats = {
  Agility: {
    basicValue: 1,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.AGILITY,
    type: StatType.PRIMARY,
    label: 'Agility'
  },
  Armor: {
    basicValue: 1,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.ARMOR,
    type: StatType.PRIMARY,
    label: 'Armor'
  },
  Bonus_Experience: {
    basicValue: 1,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.BONUS_EXPERIENCE,
    type: StatType.MISC,
    label: 'Bonus Experience'
  },
  Crit_Chance: {
    basicValue: 5.0,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.PERCENT_CRIT_CHANCE,
    type: StatType.SECONDARY,
    label: 'Critical Chance',
    percent: true
  },
  Crit_Power: {
    basicValue: 150,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.PERCENT_CRIT_DAMAGE,
    type: StatType.SECONDARY,
    label: 'Critical Damage',
    percent: true
  },
  Crit_Rating: {
    basicValue: 0,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.CRIT_CHANCE_RATING,
    type: StatType.SECONDARY,
    label: 'Critical Rating'
  },
  Health: {
    basicValue: 100,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.HEALTH,
    type: StatType.PRIMARY,
    label: 'Health Points'
  },
  Intellect: {
    basicValue: 1,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.INTELLECT,
    type: StatType.PRIMARY,
    label: 'Intellect'
  },
  Max_Damage: {
    basicValue: 2,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.MAX_DAMAGE,
    type: StatType.PRIMARY,
    label: 'Maximum Damage'
  },
  Min_Damage: {
    basicValue: 1,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.MIN_DAMAGE,
    type: StatType.PRIMARY,
    label: 'Minimal Damage'
  },
  Percent_Damage_Increase: {
    basicValue: 0,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.PERCENT_DAMAGE,
    type: StatType.SECONDARY,
    label: 'Damage Increase',
    percent: true
  },
  Percent_Experience_Increase: {
    basicValue: 0,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.PERCENT_EXPERIENCE,
    type: StatType.MISC,
    label: 'Experience Increase',
    percent: true
  },
  Power: {
    basicValue: 50,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.POWER,
    type: StatType.PRIMARY,
    label: 'Power'
  },
  Stamina: {
    basicValue: 1,
    addedValue: 0,
    totalValue: 1,
    internalName: StatName.STAMINA,
    type: StatType.PRIMARY,
    label: 'Stamina'
  },
  Strength: {
    basicValue: 1,
    addedValue: 0,
    totalValue: 0,
    internalName: StatName.STRENGTH,
    type: StatType.PRIMARY,
    label: 'Strength'
  }
}