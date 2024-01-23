import {
  BasicAttribute,
  MainAttributeNames,
  MiscAttributeNames,
  PrimaryAttributeNames,
  SecondaryAttributeNames,
} from '../../../shared/src';

const commonAttributeParams = {
  isPercent: false,
}

export const generateAttributes = (): BasicAttribute[] => {
  let allAttributes: BasicAttribute[] = [];

  allAttributes = allAttributes.concat(generateMainAttributes());

  allAttributes = allAttributes.concat(generatePrimaryAttributes());

  allAttributes = allAttributes.concat(generateSecondaryAttributes());

  allAttributes = allAttributes.concat(generateMiscAttributes());

  return allAttributes;
}

const generateMainAttributes = (): BasicAttribute[] => {
  const allMainAttributes: BasicAttribute[] = [];

  for (const attributeName in MainAttributeNames) {
    switch (attributeName) {
      case MainAttributeNames.ARMOR:
        allMainAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Armor'
        });
        break;
      case MainAttributeNames.HEALTH:
        allMainAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Health'
        });
        break;
      case MainAttributeNames.MAX_DAMAGE:
        allMainAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Maximal Damage'
        });
        break;
      case MainAttributeNames.MIN_DAMAGE:
        allMainAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Minimal Damage'
        });
        break;
      case MainAttributeNames.POWER:
        allMainAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Power'
        });
        break;
    }
  }

  return allMainAttributes;
}

const generatePrimaryAttributes = (): BasicAttribute[] => {
  const allPrimaryAttributes: BasicAttribute[] = [];

  for (const attributeName in PrimaryAttributeNames) {
    switch (attributeName) {
      case PrimaryAttributeNames.AGILITY:
        allPrimaryAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Agility'
        });
        break;
      case PrimaryAttributeNames.INTELLECT:
        allPrimaryAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Intellect'
        });
        break;
      case PrimaryAttributeNames.STAMINA:
        allPrimaryAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Stamina'
        });
        break;
      case PrimaryAttributeNames.STRENGTH:
        allPrimaryAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Strength'
        });
        break;
      default:
        throw new Error(`Missing generator for attribute type ${attributeName}`);
    }
  }
  return allPrimaryAttributes;
}

const generateSecondaryAttributes = (): BasicAttribute[] => {
  const allSecondaryAttributes: BasicAttribute[] = [];

  for (const attributeName in SecondaryAttributeNames) {
    switch (attributeName) {
      case SecondaryAttributeNames.CRIT_CHANCE_PERCENT:
        allSecondaryAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Critical Strike Chance',
          isPercent: true
        });
        break;
      case SecondaryAttributeNames.CRIT_CHANCE_RATING:
        allSecondaryAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Critical Strike Rating'
        });
        break;
      case SecondaryAttributeNames.CRIT_DAMAGE_PERCENT:
        allSecondaryAttributes.push({
          attributeName: attributeName,
          label: 'Critical Damage',
          isPercent: true
        });
        break;
      case SecondaryAttributeNames.CRIT_DAMAGE_RATING:
        allSecondaryAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Critical Damage Rating'
        });
        break;
      case SecondaryAttributeNames.MULTISTRIKE_RATING:
        allSecondaryAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Multistrike Rating'
        });
        break;
      case SecondaryAttributeNames.MULTRISTRIKE_CHANCE:
        allSecondaryAttributes.push({
          attributeName: attributeName,
          label: 'Multistrike Chance',
          isPercent: true
        });
        break;
      default:
        throw new Error(`Missing generator for attribute type ${attributeName}`);
    }
  }

  return allSecondaryAttributes;
}

const generateMiscAttributes = (): BasicAttribute[] => {
  const allMiscAttributes: BasicAttribute[] = [];

  for (const attributeName in MiscAttributeNames) {
    switch (attributeName) {
      case MiscAttributeNames.BONUS_DAMAGE_PERCENT:
        allMiscAttributes.push({
          attributeName: attributeName,
          label: 'Bonus Damage (%)',
          desc: 'Increase your damage done by percent.',
          isPercent: true
        });
        break;
      case MiscAttributeNames.BONUS_EXPERIENCE_PERCENT:
        allMiscAttributes.push({
          attributeName: attributeName,
          label: 'Bonus Experience (%)',
          desc: 'Increase your experience gained by percent.',
          isPercent: true
        });
        break;
      case MiscAttributeNames.BONUS_EXPERIENCE_STATIC:
        allMiscAttributes.push({
          ...commonAttributeParams,
          attributeName: attributeName,
          label: 'Bonus Experience',
          desc: 'Increase your experience gained by static amount.'
        });
        break;
      case MiscAttributeNames.BONUS_HEALTH_PERCENT:
        allMiscAttributes.push({
          attributeName: attributeName,
          label: 'Bonus Health (%)',
          desc: 'Increase your Health by percent.',
          isPercent: true
        });
        break;
      default:
        throw new Error(`Missing generator for attribute type ${attributeName}`);
    }
  }

  return allMiscAttributes;
}