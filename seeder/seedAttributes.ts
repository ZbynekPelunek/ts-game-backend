import mongoose from 'mongoose';

import { generateAttributes } from '../data/attributes';
import { AttributeDetailModel } from '../src/schema/attribute.schema';

const uri = 'mongodb+srv://zbynek:12345159357@cluster0.n3nt6.mongodb.net/?retryWrites=true&w=majority';

const attributesData = generateAttributes();

async function connect() {
  try {
    await mongoose.connect(uri);
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