import {
  Attribute,
  CreateCharacterAttributeRequestDTO,
  MainAttributeNames,
  PrimaryAttributeNames,
  SecondaryAttributeNames
} from '../../../shared/src';
//import { calculateAttributes } from '../engine/attributes';

export function generateDefaultCharacterAttributes(
  allAttributes: Attribute[],
  characterId: string
): CreateCharacterAttributeRequestDTO[] {
  const defaultAttributes: CreateCharacterAttributeRequestDTO[] = [];

  allAttributes.forEach((a) => {
    const attribute: CreateCharacterAttributeRequestDTO = {
      baseValue: 0,
      characterId,
      attributeName: a.attributeName
    };
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
      case PrimaryAttributeNames.AGILITY:
        attribute.baseValue = 3;
        break;
      case PrimaryAttributeNames.STRENGTH:
        attribute.baseValue = 4;
        break;
      case PrimaryAttributeNames.INTELLECT:
        attribute.baseValue = 5;
        break;
      case PrimaryAttributeNames.STAMINA:
        attribute.baseValue = 6;
        break;
      case SecondaryAttributeNames.CRIT_CHANCE_PERCENT:
        attribute.baseValue = 1;
        break;
      case SecondaryAttributeNames.CRIT_DAMAGE_PERCENT:
        attribute.baseValue = 50;
        break;
      case SecondaryAttributeNames.MULTRISTRIKE_CHANCE:
        attribute.baseValue = 0.01;
        break;
    }

    defaultAttributes.push(attribute);
  });

  //const calculatedAttributes = calculateAttributes(defaultAttributes);

  return defaultAttributes;
}
