import { CharacterAttribute, PrimaryAttributeId, SecondaryAttributeId } from '../../../shared/src';

export function calculateAttributes(attributes: Partial<CharacterAttribute>[]) {
  //console.log('attributes to calculate: ', attributes);
  const healthIndex = attributes.findIndex(ca => ca.attributeId === PrimaryAttributeId.HEALTH);
  const powerIndex = attributes.findIndex(ca => ca.attributeId === PrimaryAttributeId.POWER);
  const staminaIndex = attributes.findIndex(ca => ca.attributeId === PrimaryAttributeId.STAMINA);
  const strengthIndex = attributes.findIndex(ca => ca.attributeId === PrimaryAttributeId.STRENGTH);
  const agilityIndex = attributes.findIndex(ca => ca.attributeId === PrimaryAttributeId.AGILITY);
  const intellectIndex = attributes.findIndex(ca => ca.attributeId === PrimaryAttributeId.INTELLECT);
  const critChancePercentIndex = attributes.findIndex(ca => ca.attributeId === SecondaryAttributeId.CRIT_CHANCE_PERCENT);
  const critDamagePercentIndex = attributes.findIndex(ca => ca.attributeId === SecondaryAttributeId.CRIT_DAMAGE_PERCENT);

  const staminaValue = attributes[staminaIndex]['base-value']! + attributes[staminaIndex]['added-value']!;
  const agilityValue = attributes[agilityIndex]['base-value']! + attributes[agilityIndex]['added-value']!;
  const strengthValue = attributes[strengthIndex]['base-value']! + attributes[strengthIndex]['added-value']!;
  const intellectValue = attributes[intellectIndex]['base-value']! + attributes[intellectIndex]['added-value']!;

  attributes[healthIndex]['stats-value']! = staminaValue;
  attributes[powerIndex]['stats-value']! = intellectValue;
  attributes[critChancePercentIndex]['stats-value']! = agilityValue / 100;
  attributes[critDamagePercentIndex]['stats-value']! = strengthValue / 100;

  //console.log('finished attributes: ', attributes);
  return attributes;
}