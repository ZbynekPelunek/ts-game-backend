import {
  AttributeType,
  BasicAttribute,
  MiscAttribute,
  MiscAttributeId,
  PrimaryAttribute,
  PrimaryAttributeId,
  SecondaryAttribute,
  SecondaryAttributeId,
} from '../../shared/src';

export const generateAttributes = (): BasicAttribute[] => {
  let primary: BasicAttribute[] = [];
  let secondary: BasicAttribute[] = [];
  let misc: BasicAttribute[] = [];

  for (const attributeType in AttributeType) {
    switch (attributeType) {
      case AttributeType.PRIMARY:
        primary = generatePrimaryAttributes();
        break;
      case AttributeType.SECONDARY:
        secondary = generateSecondaryAttributes();
        break;
      case AttributeType.MISC:
        misc = generateMiscAttributes();
        break;
      default:
        throw new Error(`Missing generator for attribute type ${attributeType}`);
    }
  }

  return primary.concat(secondary, misc);
}

const generatePrimaryAttributes = (): PrimaryAttribute[] => {
  const allPrimaryAttributes: PrimaryAttribute[] = [];

  for (const attributeId in PrimaryAttributeId) {
    switch (attributeId) {
      case PrimaryAttributeId.AGILITY:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Agility'
        });
        break;
      case PrimaryAttributeId.ARMOR:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Armor'
        });
        break;
      case PrimaryAttributeId.HEALTH:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Health'
        });
        break;
      case PrimaryAttributeId.INTELLECT:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Intellect'
        });
        break;
      case PrimaryAttributeId.MAX_DAMAGE:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Maximal Damage'
        });
        break;
      case PrimaryAttributeId.MIN_DAMAGE:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Minimal Damage'
        });
        break;
      case PrimaryAttributeId.POWER:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Power'
        });
        break;
      case PrimaryAttributeId.STAMINA:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Stamina'
        });
        break;
      case PrimaryAttributeId.STRENGTH:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Strength'
        });
        break;
      default:
        throw new Error(`Missing generator for attribute type ${attributeId}`);
    }
  }
  return allPrimaryAttributes;
}

const generateSecondaryAttributes = (): SecondaryAttribute[] => {
  const allSecondaryAttributes: SecondaryAttribute[] = [];

  for (const attributeId in SecondaryAttributeId) {
    switch (attributeId) {
      case SecondaryAttributeId.CRIT_CHANCE_PERCENT:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Critical Strike Chance',
          percent: true
        });
        break;
      case SecondaryAttributeId.CRIT_CHANCE_RATING:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Critical Strike Rating'
        });
        break;
      case SecondaryAttributeId.CRIT_DAMAGE_PERCENT:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Critical Damage',
          percent: true
        });
        break;
      case SecondaryAttributeId.CRIT_DAMAGE_RATING:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Critical Damage Rating'
        });
        break;
      case SecondaryAttributeId.MULTISTRIKE_RATING:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Multistrike Rating'
        });
        break;
      case SecondaryAttributeId.MULTRISTRIKE_CHANCE:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Multistrike Chance',
          percent: true
        });
        break;
      default:
        throw new Error(`Missing generator for attribute type ${attributeId}`);
    }
  }

  return allSecondaryAttributes;
}

const generateMiscAttributes = (): MiscAttribute[] => {
  const allMiscAttributes: MiscAttribute[] = [];

  for (const attributeId in MiscAttributeId) {
    switch (attributeId) {
      case MiscAttributeId.BONUS_DAMAGE_PERCENT:
        allMiscAttributes.push({
          attributeId,
          type: AttributeType.MISC,
          label: 'Bonus Damage (%)',
          desc: 'Increase your damage done by percent.',
          percent: true
        });
        break;
      case MiscAttributeId.BONUS_EXPERIENCE_PERCENT:
        allMiscAttributes.push({
          attributeId,
          type: AttributeType.MISC,
          label: 'Bonus Experience (%)',
          desc: 'Increase your experience gained by percent.',
          percent: true
        });
        break;
      case MiscAttributeId.BONUS_EXPERIENCE_STATIC:
        allMiscAttributes.push({
          attributeId,
          type: AttributeType.MISC,
          label: 'Bonus Experience',
          desc: 'Increase your experience gained by static amount.'
        });
        break;
      case MiscAttributeId.BONUS_HEALTH_PERCENT:
        allMiscAttributes.push({
          attributeId,
          type: AttributeType.MISC,
          label: 'Bonus Health (%)',
          desc: 'Increase your Health by percent.',
          percent: true
        });
        break;
      default:
        throw new Error(`Missing generator for attribute type ${attributeId}`);
    }
  }

  return allMiscAttributes;
}