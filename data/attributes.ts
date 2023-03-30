import { Attribute, AttributeType, MiscAttributeId, PrimaryAttributeId, SecondaryAttributeId } from '../../shared/src';

export const generateAttributes = (): Attribute[] => {
  let primary: Attribute[] = [];
  let secondary: Attribute[] = [];
  let misc: Attribute[] = [];

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

const generatePrimaryAttributes = (): Attribute[] => {
  const allPrimaryAttributes: Attribute[] = [];

  for (const attributeId in PrimaryAttributeId) {
    switch (attributeId) {
      case PrimaryAttributeId.AGILITY:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Agility',
          desc: ''
        });
        break;
      case PrimaryAttributeId.ARMOR:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Armor',
          desc: ''
        });
        break;
      case PrimaryAttributeId.HEALTH:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Health',
          desc: ''
        });
        break;
      case PrimaryAttributeId.INTELLECT:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Intellect',
          desc: ''
        });
        break;
      case PrimaryAttributeId.MAX_DAMAGE:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Maximal Damage',
          desc: ''
        });
        break;
      case PrimaryAttributeId.MIN_DAMAGE:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Minimal Damage',
          desc: ''
        });
        break;
      case PrimaryAttributeId.POWER:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Power',
          desc: ''
        });
        break;
      case PrimaryAttributeId.STAMINA:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Stamina',
          desc: ''
        });
        break;
      case PrimaryAttributeId.STRENGTH:
        allPrimaryAttributes.push({
          attributeId,
          type: AttributeType.PRIMARY,
          label: 'Strength',
          desc: ''
        });
        break;
      default:
        throw new Error(`Missing generator for attribute type ${attributeId}`);
    }
  }
  return allPrimaryAttributes;
}

const generateSecondaryAttributes = (): Attribute[] => {
  const allSecondaryAttributes: Attribute[] = [];

  for (const attributeId in SecondaryAttributeId) {
    switch (attributeId) {
      case SecondaryAttributeId.CRIT_CHANCE_PERCENT:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Critical Strike Chance',
          desc: '',
          percent: true
        });
        break;
      case SecondaryAttributeId.CRIT_CHANCE_RATING:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Critical Strike Rating',
          desc: ''
        });
        break;
      case SecondaryAttributeId.CRIT_DAMAGE_PERCENT:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Critical Damage',
          desc: '',
          percent: true
        });
        break;
      case SecondaryAttributeId.CRIT_DAMAGE_RATING:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Critical Damage Rating',
          desc: ''
        });
        break;
      case SecondaryAttributeId.MULTISTRIKE_RATING:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Multistrike Rating',
          desc: ''
        });
        break;
      case SecondaryAttributeId.MULTRISTRIKE_CHANCE:
        allSecondaryAttributes.push({
          attributeId,
          type: AttributeType.SECONDARY,
          label: 'Multistrike Chance',
          desc: '',
          percent: true
        });
        break;
      default:
        throw new Error(`Missing generator for attribute type ${attributeId}`);
    }
  }

  return allSecondaryAttributes;
}

const generateMiscAttributes = (): Attribute[] => {
  const allMiscAttributes: Attribute[] = [];

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