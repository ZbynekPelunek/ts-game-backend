import express from 'express';
import mongoose from 'mongoose';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middleware/errorHandler';
import { accountsRouter } from './routes/accounts.router';
import { adventuresRouter } from './routes/adventures.router';
import { attributesRouter } from './routes/attributes.router';
import { characterAttributesRouter } from './routes/characterAttributes';
import { charactersRouter } from './routes/characters.router';
import { inventoriesRouter } from './routes/inventory.router';
import { resultsRouter } from './routes/results.router';
import { AccountModel } from './schema/account.schema';
import { CharacterModel } from './schema/character.schema';
import { CharacterAttributeModel } from './schema/characterAttribute.schema';

const app = express();
const PORT: Number = 3000;

const uri = 'mongodb+srv://zbynek:12345159357@cluster0.n3nt6.mongodb.net/?retryWrites=true&w=majority';

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    console.log('cleaning accounts...');
    await AccountModel.deleteMany({});
    console.log('...accounts cleaned.');

    console.log('cleaning characters...');
    await CharacterModel.deleteMany({});
    console.log('...characters cleaned.');

    console.log('cleaning character attributes...');
    await CharacterAttributeModel.deleteMany({});
    console.log('...character attributes cleaned.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, PUT, DELETE, POST');

  next();
});

app.use('/api/v1/accounts', accountsRouter);
app.use('/api/v1/characters', charactersRouter);
app.use('/api/v1/adventures', adventuresRouter);
app.use('/api/v1/results', resultsRouter);
app.use('/api/v1/inventories', inventoriesRouter);
app.use('/api/v1/attributes', attributesRouter);
app.use('/api/v1/character-attributes', characterAttributesRouter);

app.all('*', async (req, _res) => {
  throw new NotFoundError(`Route ${req.url} does not exist.`);
});

app.use(errorHandler);

connect();
app.listen(PORT, () => {
  console.log('The application is listening on port http://localhost:' + PORT);
})
