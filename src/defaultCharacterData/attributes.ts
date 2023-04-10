import mongoose from 'mongoose';

import {
  BasicAttributeFrontend,
  CharacterAttributeBackend,
  CharacterAttributeFrontendPopulated,
  MainAttributeNames,
  PrimaryAttributeNames,
  SecondaryAttributeNames,
} from '../../../shared/src';
import { calculateAttributes } from '../engine/attributes';

const commonCharAttributesValues = {
  "base-value": 0,
  "added-value": 0,
  "stats-added-value": 0,
  "total-value": 0
}

export function generateDefaultCharacterAttributes(allAttributes: BasicAttributeFrontend[], characterId: string): CharacterAttributeBackend[] {
  const defaultAttributes: CharacterAttributeBackend[] = [];

  const convertCharacterId = new mongoose.Types.ObjectId(characterId);

  allAttributes.forEach(a => {
    const attribute: CharacterAttributeBackend = {
      ...commonCharAttributesValues,
      characterId: convertCharacterId,
      attributeId: new mongoose.Types.ObjectId(a.attributeId),
      attribute: a
    }
    switch (a.attributeName) {
      case MainAttributeNames.HEALTH:
        attribute['base-value'] = 20;
        break;
      case MainAttributeNames.POWER:
        attribute['base-value'] = 10;
        break;
      case MainAttributeNames.MIN_DAMAGE:
        attribute['base-value'] = 1;
        break;
      case MainAttributeNames.MAX_DAMAGE:
        attribute['base-value'] = 2;
        break;
      case MainAttributeNames.ARMOR:
        attribute['base-value'] = 100;
        break;
      case PrimaryAttributeNames.AGILITY:
        attribute['base-value'] = 3;
        break;
      case PrimaryAttributeNames.STRENGTH:
        attribute['base-value'] = 4;
        break;
      case PrimaryAttributeNames.INTELLECT:
        attribute['base-value'] = 5;
        break;
      case PrimaryAttributeNames.STAMINA:
        attribute['base-value'] = 6;
        break;
      case SecondaryAttributeNames.CRIT_CHANCE_PERCENT:
        attribute['base-value'] = 1;
        break;
      case SecondaryAttributeNames.CRIT_DAMAGE_PERCENT:
        attribute['base-value'] = 50;
        break;
      case SecondaryAttributeNames.MULTRISTRIKE_CHANCE:
        attribute['base-value'] = 0.01;
        break;
    }

    attribute['total-value'] = attribute['base-value'];
    defaultAttributes.push(attribute);
  });

  const calculatedAttributes = calculateAttributes(defaultAttributes);

  return calculatedAttributes;
}