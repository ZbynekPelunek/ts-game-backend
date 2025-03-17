import {
  CharacterAttributeDTO,
  EnemyAttribute,
  EnemyDTO,
  MainAttributeNames
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
    characterAttributes: CharacterAttributeDTO[],
    enemy: EnemyDTO
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
    characterAttributes: CharacterAttributeDTO[]
  ): AttackerTarget => {
    return {
      name: characterName,
      damage: characterAttributes.filter(
        (ca) => ca.attributeName === MainAttributeNames.MAX_DAMAGE
      )[0].totalValue,
      health: characterAttributes.filter(
        (ca) => ca.attributeName === MainAttributeNames.HEALTH
      )[0].totalValue
    };
  };

  private transformEnemyToTarget(
    enemyName: string,
    enemyAttributes: EnemyAttribute[]
  ) {
    const transformedAttributes = enemyAttributes.reduce(
      (obj: { [key: string]: number }, item) => ({
        ...obj,
        [item.attributeName]: item.value
      }),
      {}
    );

    return {
      name: enemyName,
      damage: transformedAttributes[MainAttributeNames.MAX_DAMAGE],
      health: transformedAttributes[MainAttributeNames.HEALTH]
    };
  }
}
