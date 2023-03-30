import { CharacterAttribute, MiscAttributeId, PrimaryAttributeId, SecondaryAttributeId } from '../../../shared/src';

export const defaultChracterAttributes: CharacterAttribute[] = [
  {
    "added-value": 0,
    "base-value": 100,
    attributeId: PrimaryAttributeId.HEALTH
  },
  {
    "added-value": 0,
    "base-value": 1,
    attributeId: PrimaryAttributeId.AGILITY
  },
  {
    "added-value": 0,
    "base-value": 1,
    attributeId: PrimaryAttributeId.STAMINA
  },
  {
    "added-value": 0,
    "base-value": 1,
    attributeId: PrimaryAttributeId.STRENGTH
  },
  {
    "added-value": 0,
    "base-value": 10,
    attributeId: PrimaryAttributeId.ARMOR
  },
  {
    "added-value": 0,
    "base-value": 1,
    attributeId: PrimaryAttributeId.INTELLECT
  },
  {
    "added-value": 0,
    "base-value": 1,
    attributeId: PrimaryAttributeId.MIN_DAMAGE
  },
  {
    "added-value": 0,
    "base-value": 2,
    attributeId: PrimaryAttributeId.MAX_DAMAGE
  },
  {
    "added-value": 0,
    "base-value": 10,
    attributeId: PrimaryAttributeId.POWER
  },
  {
    "added-value": 0,
    "base-value": 1,
    attributeId: SecondaryAttributeId.CRIT_CHANCE_PERCENT
  },
  {
    "added-value": 0,
    "base-value": 0,
    attributeId: SecondaryAttributeId.CRIT_CHANCE_RATING
  },
  {
    "added-value": 0,
    "base-value": 50,
    attributeId: SecondaryAttributeId.CRIT_DAMAGE_PERCENT
  },
  {
    "added-value": 0,
    "base-value": 0,
    attributeId: SecondaryAttributeId.CRIT_DAMAGE_RATING
  },
  {
    "added-value": 0,
    "base-value": 0,
    attributeId: MiscAttributeId.BONUS_DAMAGE_PERCENT
  },
  {
    "added-value": 0,
    "base-value": 0,
    attributeId: MiscAttributeId.BONUS_EXPERIENCE_PERCENT
  },
  {
    "added-value": 0,
    "base-value": 0,
    attributeId: MiscAttributeId.BONUS_EXPERIENCE_STATIC
  },
  {
    "added-value": 0,
    "base-value": 0,
    attributeId: MiscAttributeId.BONUS_HEALTH_PERCENT
  },
]