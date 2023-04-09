import {
  CommonCharacterAttributeParams,
  MainAttributeId,
  MiscAttributeId,
  PrimaryAttributeId,
  SecondaryAttributeId,
} from '../../../shared/src';

export const defaultCharacterAttributes: Partial<CommonCharacterAttributeParams>[] = [
  // MAIN
  {
    "base-value": 10,
    attributeId: MainAttributeId.HEALTH
  },
  {
    "base-value": 10,
    attributeId: MainAttributeId.ARMOR
  },
  {
    "base-value": 1,
    attributeId: MainAttributeId.MIN_DAMAGE
  },
  {
    "base-value": 2,
    attributeId: MainAttributeId.MAX_DAMAGE
  },
  {
    "base-value": 10,
    attributeId: MainAttributeId.POWER
  },

  // PRIMARY
  {
    "base-value": 1,
    attributeId: PrimaryAttributeId.AGILITY
  },
  {
    "base-value": 15,
    attributeId: PrimaryAttributeId.STAMINA
  },
  {
    "base-value": 1,
    attributeId: PrimaryAttributeId.STRENGTH
  },
  {
    "base-value": 1,
    attributeId: PrimaryAttributeId.INTELLECT
  },

  // SECONDARY
  {
    "base-value": 1,
    attributeId: SecondaryAttributeId.CRIT_CHANCE_PERCENT
  },
  {
    "base-value": 0,
    attributeId: SecondaryAttributeId.CRIT_CHANCE_RATING
  },
  {
    "base-value": 50,
    attributeId: SecondaryAttributeId.CRIT_DAMAGE_PERCENT
  },
  {
    "base-value": 0,
    attributeId: SecondaryAttributeId.CRIT_DAMAGE_RATING
  },

  // MISC
  {
    "base-value": 0,
    attributeId: MiscAttributeId.BONUS_DAMAGE_PERCENT
  },
  {
    "base-value": 0,
    attributeId: MiscAttributeId.BONUS_EXPERIENCE_PERCENT
  },
  {
    "base-value": 0,
    attributeId: MiscAttributeId.BONUS_EXPERIENCE_STATIC
  },
  {
    "base-value": 0,
    attributeId: MiscAttributeId.BONUS_HEALTH_PERCENT
  },
]