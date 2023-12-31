import 'dotenv/config'
import mongoose from 'mongoose';

import { Armor, Weapon } from '../../shared/src';
import { starterArmor, starterWeapons } from '../data/items';
import { ItemsEquipmentModel } from '../src/schema/item.schema';

const uri = process.env.MONGOOSE_URI;

const equipmentArmorData: Armor[] = starterArmor;
const equipmentWeaponData: Weapon[] = starterWeapons;

async function connect() {
  try {
    await mongoose.connect(uri!);
    console.log('Connected to MongoDB');

    console.log('Clearing previously saved items...');
    await ItemsEquipmentModel.deleteMany({});
    console.log('...clearing done');
    await ItemsEquipmentModel.insertMany(equipmentArmorData);
    await ItemsEquipmentModel.insertMany(equipmentWeaponData);
    console.log('seeding done');

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connect();