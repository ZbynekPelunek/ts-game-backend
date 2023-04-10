import {
  CharacterAttributeBackend,
  CharacterAttributeFrontend,
  CharacterAttributeFrontendPopulated,
  CommonCharacterAttributeParams,
  MainAttributeNames,
  PrimaryAttributeNames,
  SecondaryAttributeNames,
} from '../../../shared/src';

export function calculateAttributes(attributes: CharacterAttributeBackend[]) {
  // console.log('attributes to calculate: ', attributes);

  attributes.forEach((att) => {
    if (!att.attribute) return;
    switch (att.attribute.attributeName) {
      case PrimaryAttributeNames.STAMINA:
        att['total-value'] = updateAttributeTotal(att);
        const healthIndex = attributes.findIndex(ca => ca.attribute?.attributeName === MainAttributeNames.HEALTH);
        attributes[healthIndex]['stats-added-value'] = att['total-value'];
        attributes[healthIndex]['total-value'] = updateAttributeTotal(attributes[healthIndex]);
        break;

      case PrimaryAttributeNames.INTELLECT:
        att['total-value'] = updateAttributeTotal(att);
        const powerIndex = attributes.findIndex(ca => ca.attribute?.attributeName === MainAttributeNames.POWER);
        attributes[powerIndex]['stats-added-value'] = att['total-value'];
        attributes[powerIndex]['total-value'] = updateAttributeTotal(attributes[powerIndex]);
        break;

      case PrimaryAttributeNames.STRENGTH:
        att['total-value'] = updateAttributeTotal(att);
        const critDamagePercentIndex = attributes.findIndex(ca => ca.attribute?.attributeName === SecondaryAttributeNames.CRIT_DAMAGE_PERCENT);
        attributes[critDamagePercentIndex]['stats-added-value'] = att['total-value'] / 100;
        attributes[critDamagePercentIndex]['total-value'] = updateAttributeTotal(attributes[critDamagePercentIndex]);
        break;
      case PrimaryAttributeNames.AGILITY:
        att['total-value'] = updateAttributeTotal(att);
        const critChancePercentIndex = attributes.findIndex(ca => ca.attribute?.attributeName === SecondaryAttributeNames.CRIT_CHANCE_PERCENT);
        attributes[critChancePercentIndex]['stats-added-value'] = att['total-value'] / 100;
        attributes[critChancePercentIndex]['total-value'] = updateAttributeTotal(attributes[critChancePercentIndex]);
        break;
      default:
        att['total-value'] = att['base-value'] + att['added-value'] + att['stats-added-value'];
    }
  });

  //console.log('finished calculated attributes: ', attributes);
  return attributes;
}

function updateAttributeTotal(charAttribute: CharacterAttributeFrontend | CommonCharacterAttributeParams): number {
  return charAttribute['base-value'] + charAttribute['added-value'] + charAttribute['stats-added-value'];
}