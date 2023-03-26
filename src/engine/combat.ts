import { AttackerTarget } from '../interface/combat.interface';

export class Combat {
  round: number = 0;
  log: string = '';
  playerWon: boolean = false;

  attack = (attacker: AttackerTarget, target: AttackerTarget, playerAttacking: boolean) => {
    this.round++;

    target.health -= attacker.damage;

    if (target.health > 0) {
      this.attack(target, attacker, !playerAttacking);
    } else {
      target.health = 0;
      this.log = `${attacker.name} won with ${attacker.health} hp left in ${this.round} rounds`
      console.log(this.log);
      if (playerAttacking) {
        this.playerWon = true;
      }
    }
  }
}