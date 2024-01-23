import 'dotenv/config'
import mongoose from 'mongoose';

import { defaultCurrencies } from '../data/currencies';
import { CurrencyModel } from '../schema/currency.schema';

const uri = process.env.MONGOOSE_URI_DEV;
const currencyData = defaultCurrencies;

async function connect() {
  try {
    await mongoose.connect(uri!);
    console.log('Connected to MongoDB');

    await CurrencyModel.deleteMany({});
    await CurrencyModel.insertMany(currencyData);
    console.log('seeding done');

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connect();