import 'dotenv/config';
import mongoose from 'mongoose';

import { Armor, Weapon } from '../../../shared/src';
import { starterArmor, starterWeapons } from '../data/items';
import { EquipmentModel } from '../models/item.model';

const uri = process.env.MONGOOSE_URI_DEV;

const equipmentArmorData: Armor[] = starterArmor;
const equipmentWeaponData: Weapon[] = starterWeapons;

async function connect() {
  try {
    await mongoose.connect(uri!);
    console.log('Connected to MongoDB');

    console.log('Clearing previously saved items...');
    await EquipmentModel.deleteMany({});
    console.log('...clearing done');

    await EquipmentModel.insertMany(equipmentArmorData);
    await EquipmentModel.insertMany(equipmentWeaponData);
    console.log('seeding done');

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connect();
