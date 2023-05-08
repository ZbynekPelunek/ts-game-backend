import { Types } from 'mongoose';

import {
  BasicAttributeFrontend,
  CharacterAttributeBackend,
  MainAttributeNames,
  PrimaryAttributeName,
  SecondaryAttributeName,
} from '../../../shared/src';
import { calculateAttributes } from '../engine/attributes';

const commonCharAttributesValues = {
  baseValue: 0,
  addedValue: 0,
  statsAddedValue: 0,
  totalValue: 0
}

export function generateDefaultCharacterAttributes(allAttributes: BasicAttributeFrontend[], characterId: string): CharacterAttributeBackend[] {
  const defaultAttributes: CharacterAttributeBackend[] = [];

  const convertCharacterId = new Types.ObjectId(characterId);

  allAttributes.forEach(a => {
    const attribute: CharacterAttributeBackend = {
      ...commonCharAttributesValues,
      characterId: convertCharacterId,
      attributeId: new Types.ObjectId(a.attributeId),
      attribute: a
    }
    switch (a.attributeName) {
      case MainAttributeNames.HEALTH:
        attribute.baseValue = 20;
        break;
      case MainAttributeNames.POWER:
        attribute.baseValue = 10;
        break;
      case MainAttributeNames.MIN_DAMAGE:
        attribute.baseValue = 1;
        break;
      case MainAttributeNames.MAX_DAMAGE:
        attribute.baseValue = 2;
        break;
      case MainAttributeNames.ARMOR:
        attribute.baseValue = 100;
        break;
      case PrimaryAttributeName.AGILITY:
        attribute.baseValue = 3;
        break;
      case PrimaryAttributeName.STRENGTH:
        attribute.baseValue = 4;
        break;
      case PrimaryAttributeName.INTELLECT:
        attribute.baseValue = 5;
        break;
      case PrimaryAttributeName.STAMINA:
        attribute.baseValue = 6;
        break;
      case SecondaryAttributeName.CRIT_CHANCE_PERCENT:
        attribute.baseValue = 1;
        break;
      case SecondaryAttributeName.CRIT_DAMAGE_PERCENT:
        attribute.baseValue = 50;
        break;
      case SecondaryAttributeName.MULTRISTRIKE_CHANCE:
        attribute.baseValue = 0.01;
        break;
    }

    attribute.totalValue = attribute.baseValue;
    defaultAttributes.push(attribute);
  });

  const calculatedAttributes = calculateAttributes(defaultAttributes);

  return calculatedAttributes;
}