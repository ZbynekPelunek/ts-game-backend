import 'dotenv/config';
import mongoose from 'mongoose';

import { generateAttributes } from '../data/attributes';
import { AttributeDetailModel } from '../schema/attribute.schema';

const uri = process.env.MONGOOSE_URI_DEV;

const attributesData = generateAttributes();

async function connect() {
  try {
    await mongoose.connect(uri!);
    console.log('Connected to MongoDB');

    await AttributeDetailModel.deleteMany({});
    await AttributeDetailModel.insertMany(attributesData);
    console.log('seeding done');

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connect();
