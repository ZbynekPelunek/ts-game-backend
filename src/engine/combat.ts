import {
  CharacterAttributeBackend,
  CharacterAttributeFrontendPopulated,
  Enemy,
  EnemyAttribute,
  MainAttributeNames,
} from '../../../shared/src';

export interface AttackerTarget {
  name: string;
  health: number;
  damage: number;
}

export class Combat {
  round: number = 0;
  log: string = '';
  playerWon: boolean = false;

  start = (
    characterName: string,
    characterAttributes: CharacterAttributeFrontendPopulated[],
    enemy: Enemy
  ) => {
    const attacker = this.transformCharacterToAttacker(
      characterName,
      characterAttributes
    );
    const target = this.transformEnemyToTarget(enemy.name, enemy.attributes);

    this.attack(attacker, target, true);
  };

  private attack = (
    attacker: AttackerTarget,
    target: AttackerTarget,
    playerAttacking: boolean
  ) => {
    this.round++;

    target.health -= attacker.damage;

    if (target.health > 0) {
      this.attack(target, attacker, !playerAttacking);
    } else {
      target.health = 0;
      this.log = `${attacker.name} won with ${attacker.health} hp left in ${this.round} rounds`;
      console.log(this.log);
      if (playerAttacking) {
        this.playerWon = true;
      }
    }
  };

  private transformCharacterToAttacker = (
    characterName: string,
    characterAttributes: CharacterAttributeFrontendPopulated[]
  ): AttackerTarget => {
    const transformedAttributes = characterAttributes.reduce(
      (obj: { [key: string]: number }, item) => ({
        ...obj,
        [item.attribute.attributeName]: item.totalValue,
      }),
      {}
    );

    return {
      name: characterName,
      damage: transformedAttributes[MainAttributeNames.MAX_DAMAGE],
      health: transformedAttributes[MainAttributeNames.HEALTH],
    };
  };

  private transformEnemyToTarget(
    enemyName: string,
    enemyAttributes: EnemyAttribute[]
  ) {
    const transformedAttributes = enemyAttributes.reduce(
      (obj: { [key: string]: number }, item) => ({
        ...obj,
        [item.attributeName]: item.value,
      }),
      {}
    );

    return {
      name: enemyName,
      damage: transformedAttributes[MainAttributeNames.MAX_DAMAGE],
      health: transformedAttributes[MainAttributeNames.HEALTH],
    };
  }
}
