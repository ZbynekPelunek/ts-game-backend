import mongoose from 'mongoose';

import { EquipmentItemBackend } from '../../shared/src';
import { starterArmor, starterWeapons } from '../data/items';
import { EquipmentItemModel } from '../src/schema/item.schema';

const uri = 'mongodb+srv://zbynek:12345159357@cluster0.n3nt6.mongodb.net/?retryWrites=true&w=majority';

const equipmentArmorData: EquipmentItemBackend[] = starterArmor;
const equipmentWeaponData: EquipmentItemBackend[] = starterWeapons;

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    await EquipmentItemModel.deleteMany({});
    await EquipmentItemModel.insertMany(equipmentArmorData);
    await EquipmentItemModel.insertMany(equipmentWeaponData);
    console.log('seeding done');

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connect();