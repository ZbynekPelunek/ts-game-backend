import 'dotenv/config';
import mongoose from 'mongoose';

import { generateAttributes } from '../data/attributes';
import { AttributeModel } from '../models/attribute.model';

const uri = process.env.MONGOOSE_URI_DEV;

const attributesData = generateAttributes();

async function connect() {
  try {
    await mongoose.connect(uri!);
    console.log('Connected to MongoDB');

    await AttributeModel.deleteMany({});
    await AttributeModel.insertMany(attributesData);
    console.log('seeding done');

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connect();
