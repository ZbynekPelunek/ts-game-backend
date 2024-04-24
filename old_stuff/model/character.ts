export class Character {
  constructor(
    public accountId: string,
    public _id: string,
    public name: string,
    public stats = [],
    public level: number = 1,
    public currentExperience: number = 0,
    public maxExperience: number = 200,
    public maxInventorySlots: number = 8,
    public currencies = [],

    //public adventures: IAdventure[] = characterAvailableAdventures,
    public createdAt: string = new Date().toISOString(),
    public updatedAt: string = new Date().toISOString()
  ) {
    //this.generateInventory();
    //this.checkCharacterEquipmentSlots();
    //this.updateStatsTotalValue();
    //this.calculateStatsValue();
  }

  public addExperience(experience: number) {
    this.currentExperience += experience;
    this.checkLevelUp();
  }

  // public updateStatsTotalValue(): void {
  //   console.log('Updating total values...');
  //   const characterStats = { ...this.stats }
  //   for (const value of Object.values(characterStats)) {
  //     value.totalValue = value.basicValue + value.addedValue;
  //   }
  //   this.stats = { ...characterStats };
  //   console.log('...total values updated.');
  // }

  // public calculateStatsValue(): void {
  //   console.log('Calculating stats value...');
  //   const characterStats = { ...this.stats };
  //   characterStats.Health.totalValue += characterStats.Stamina.totalValue;
  //   characterStats.Power.totalValue += characterStats.Intellect.totalValue;
  //   characterStats.Crit_Chance.totalValue = _.round(characterStats.Crit_Chance.totalValue, 2) + _.round((characterStats.Crit_Rating.totalValue / 10), 2);
  //   characterStats.Min_Damage.totalValue *= (characterStats.Percent_Damage_Increase.totalValue / 100) + 1;
  //   characterStats.Max_Damage.totalValue *= (characterStats.Percent_Damage_Increase.totalValue / 100) + 1;
  //   this.stats = { ...characterStats };
  //   console.log('...calculating stats finished.');
  // }

  // public updateStats(statsToAdd: ItemStat[] = [], statsToRemove: ItemStat[] = []): void {
  //   const characterStats = { ...this.stats };
  //   if (statsToAdd.length > 0) {
  //     console.log('adding stats: ', statsToAdd);
  //     for (const statParams of Object.values(characterStats)) {
  //       statsToAdd.forEach(stat => {
  //         if (stat.statName === statParams.internalName) {
  //           statParams.addedValue += stat.statValue;
  //         }
  //       })
  //     }
  //   }

  //   if (statsToRemove.length > 0) {
  //     console.log('removing stats: ', statsToRemove);
  //     for (const statParams of Object.values(characterStats)) {
  //       statsToRemove.forEach(stat => {
  //         if (stat.statName === statParams.internalName) {
  //           statParams.addedValue -= stat.statValue;
  //         }
  //       })
  //     }
  //   }

  //   this.stats = { ...characterStats };
  //   this.updateStatsTotalValue();
  //   this.calculateStatsValue();
  // }

  // public updateCurrencies(amountToAdd: Currencies | undefined = undefined, amountToRemove: Currencies | undefined = undefined): void {
  //   const characterCurrencies = { ...this.currencies };
  //   if (amountToAdd) {
  //     console.log('Increasing currencies: ', amountToAdd);
  //     characterCurrencies.gold = (+characterCurrencies.gold + +amountToAdd.gold).toString();
  //     characterCurrencies.cheating_currency = (+characterCurrencies.cheating_currency + +amountToAdd.cheating_currency).toString();
  //     console.log('...currencies increased.');
  //   }

  //   if (amountToRemove) {
  //     console.log('Decreasing currencies: ', amountToRemove);
  //     characterCurrencies.gold = (+characterCurrencies.gold - +amountToRemove.gold).toString();
  //     characterCurrencies.cheating_currency = (+characterCurrencies.cheating_currency - +amountToRemove.cheating_currency).toString();;
  //     console.log('...currencies decreased.', amountToRemove);
  //   }

  //   this.currencies = { ...characterCurrencies };
  // }

  // public addItemToInventory(item: InventoryItem, positionIndex: number | undefined = -1): void {
  //   console.log('adding item to inventory...', item);
  //   if (this.isInventoryFull()) {
  //     console.log('inventory is full');
  //     return;
  //   }

  //   if (positionIndex > 0) {
  //     this.inventory[positionIndex].item = { ...item, positionIndex, equipped: false };
  //     console.log(`...item added to positionindex ${positionIndex}`);
  //   } else {
  //     const freeSpotIndex = this.inventory.findIndex(i => i.item === null);
  //     this.inventory[freeSpotIndex].item = { ...item, positionIndex: freeSpotIndex, equipped: false };
  //     console.log(`...item added to positionindex ${freeSpotIndex}`);
  //   }
  // }

  // public isInventoryFull(): boolean {
  //   const itemsArr = this.inventory.map(items => items.item).filter(items => items !== null);
  //   return itemsArr.length >= this.maxInventorySlots ? true : false

  // }

  private checkLevelUp(): void {
    if (this.currentExperience >= this.maxExperience) {
      const overMaxXP = this.currentExperience - this.maxExperience;
      this.maxExperience += 100;
      this.level++;
      console.log('currentExperience: ', this.currentExperience);
      console.log('maxExperience: ', this.maxExperience);
      console.log('overMaxXP: ', overMaxXP);
      this.currentExperience = overMaxXP;
      this.checkLevelUp();
    }
  }

  // private generateInventory(): void {
  //   console.log('Generating character inventory...')
  //   for (let i = 0; i < this.maxInventorySlots; i++) {
  //     this.inventory.push({ item: null });
  //   }
  //   console.log(`...inventory generated with ${this.maxInventorySlots} slots.`)
  // }

  // private checkCharacterEquipmentSlots() {
  //   console.log('Checking character equipment slots...')
  //   this.equipmentSlots.forEach(es => {
  //     if (es.equipment !== null) {
  //       console.log('...equipment found, updating character stats...')
  //       this.updateStats(es.equipment.statsEffects.default);
  //       this.updateStats(es.equipment.statsEffects.rolledAffixes);
  //       es.equipment.positionIndex = this.equipmentSlots.findIndex((eqs) => eqs.equipment?.slot === eqs.slot);
  //     }
  //   })
  //   console.log('...character equipment slots checked.')
  // }

  // public equipItem(equipment: IArmor | IWeapon): boolean {
  //   if (Object.is(this.inventory[equipment.positionIndex!].item, equipment)) {
  //     console.log('item not found in inventory');
  //     console.log('item in inventory: ', this.inventory[equipment.positionIndex!].item);
  //     console.log('equipment sent: ', equipment);
  //     return false;
  //   }
  //   console.log('inventory index: ', equipment.positionIndex);
  //   const equipSlotIndex = this.equipmentSlots.findIndex(es => es.slot === equipment.slot);
  //   if (this.equipmentSlots[equipSlotIndex].equipment === null) {
  //     console.log('Equiping item to empty slot')
  //     this.equipmentSlots[equipSlotIndex].equipment = {
  //       ...equipment,
  //       positionIndex: equipSlotIndex,
  //       equipped: true
  //     };
  //     this.inventory[equipment.positionIndex!].item = null;
  //     this.updateCharacterStats(equipment.stats);
  //     return true;
  //   }
  //   if (this.equipmentSlots[equipSlotIndex].equipment !== null) {
  //     console.log('Equiping item to filled slot')
  //     const equippedItem: IArmor | IWeapon = this.equipmentSlots[equipSlotIndex].equipment!;
  //     this.equipmentSlots[equipSlotIndex].equipment = {
  //       ...equipment,
  //       positionIndex: equipSlotIndex,
  //       equipped: true
  //     }
  //     this.inventory[equipment.positionIndex!].item = {
  //       ...equippedItem,
  //       positionIndex: equipment.positionIndex,
  //       equipped: false
  //     }
  //     this.updateCharacterStats(equipment.stats, equippedItem.stats);
  //     return true;
  //   }
  //   return false;
  //   //console.log('equipmentSlots: ', this.equipmentSlots);
  //   //console.log('inventory: ', this.inventory);
  // }

  // public unequipItem(equippedItem: IArmor | IWeapon): boolean {
  //   if (this.isInventoryFull()) {
  //     console.log('full inventory')
  //     return false;
  //   }
  //   const freeSpotIndex = this.inventory.findIndex(i => i.item === null);
  //   this.inventory[freeSpotIndex].item = {
  //     ...equippedItem,
  //     positionIndex: freeSpotIndex,
  //     equipped: false
  //   }
  //   this.equipmentSlots[equippedItem.positionIndex!].equipment = null;

  //   this.updateCharacterStats(undefined, equippedItem.stats);
  //   return true;
  // }
}
