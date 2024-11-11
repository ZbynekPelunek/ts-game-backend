import {
  CharacterAttributeFrontend,
  CommonCharacterAttributeParams,
  MainAttributeNames,
  PrimaryAttributeNames,
  SecondaryAttributeNames,
} from '../../../shared/src';

export function calculateAttributes(
  attributes: CharacterAttributeFrontend[]
): CharacterAttributeFrontend[] {
  console.log('calculating attributes...');

  attributes.forEach((att) => {
    if (!att.attribute) return;
    switch (att.attribute.attributeName) {
      case PrimaryAttributeNames.STAMINA:
        att.totalValue = updateAttributeTotal(att);
        const healthIndex = attributes.findIndex(
          (ca) => ca.attribute?.attributeName === MainAttributeNames.HEALTH
        );
        attributes[healthIndex].otherAttributesAddedValue = att.totalValue;
        attributes[healthIndex].totalValue = updateAttributeTotal(
          attributes[healthIndex]
        );
        break;

      case PrimaryAttributeNames.INTELLECT:
        att.totalValue = updateAttributeTotal(att);
        const powerIndex = attributes.findIndex(
          (ca) => ca.attribute?.attributeName === MainAttributeNames.POWER
        );
        attributes[powerIndex].otherAttributesAddedValue = att.totalValue;
        attributes[powerIndex].totalValue = updateAttributeTotal(
          attributes[powerIndex]
        );
        break;

      case PrimaryAttributeNames.STRENGTH:
        att.totalValue = updateAttributeTotal(att);
        const critDamagePercentIndex = attributes.findIndex(
          (ca) =>
            ca.attribute?.attributeName ===
            SecondaryAttributeNames.CRIT_DAMAGE_PERCENT
        );
        attributes[critDamagePercentIndex].otherAttributesAddedValue =
          att.totalValue / 100;
        attributes[critDamagePercentIndex].totalValue = updateAttributeTotal(
          attributes[critDamagePercentIndex]
        );
        break;
      case PrimaryAttributeNames.AGILITY:
        att.totalValue = updateAttributeTotal(att);
        const critChancePercentIndex = attributes.findIndex(
          (ca) =>
            ca.attribute?.attributeName ===
            SecondaryAttributeNames.CRIT_CHANCE_PERCENT
        );
        attributes[critChancePercentIndex].otherAttributesAddedValue =
          att.totalValue / 100;
        attributes[critChancePercentIndex].totalValue = updateAttributeTotal(
          attributes[critChancePercentIndex]
        );
        break;
      default:
        att.totalValue = updateAttributeTotal(att);
    }
  });

  console.log('...finished calculating attributes');
  return attributes;
}

function updateAttributeTotal(
  charAttribute: CharacterAttributeFrontend | CommonCharacterAttributeParams
): number {
  return (
    charAttribute.baseValue +
    charAttribute.equipmentAddedValue +
    charAttribute.otherAttributesAddedValue
  );
}
