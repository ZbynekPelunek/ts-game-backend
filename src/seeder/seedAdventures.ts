import 'dotenv/config';
import mongoose from 'mongoose';

import { BEGINNER_ADVENTURES } from '../data/adventures';
import { AdventureModel } from '../models/adventure.model';

const uri = process.env.MONGOOSE_URI_DEV;

const adventuresData = BEGINNER_ADVENTURES;

async function connect() {
  try {
    await mongoose.connect(uri!);
    console.log('Connected to MongoDB');

    await AdventureModel.deleteMany({});
    await AdventureModel.insertMany(adventuresData);
    console.log('seeding adventures done');

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connect();
