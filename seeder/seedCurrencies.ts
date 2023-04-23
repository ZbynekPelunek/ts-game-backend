import mongoose from 'mongoose';

import { defaultCurrencies } from '../data/currencies';
import { CurrencyModel } from '../src/schema/currency.schema';

const uri = 'mongodb+srv://zbynek:12345159357@cluster0.n3nt6.mongodb.net/?retryWrites=true&w=majority';

const currencyData = defaultCurrencies;

async function connect() {
  try {
    await mongoose.connect(uri);
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