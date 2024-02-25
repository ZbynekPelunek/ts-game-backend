import express from 'express';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middleware/errorHandler';
import { accountsRouter } from './routes/account.routes';
import { adventuresRouter } from './routes/adventures.router';
import { attributesRouter } from './routes/attributes.router';
import { characterAttributesRouter } from './routes/characterAttributes.router';
import { characterCurrenciesRouter } from './routes/characterCurrencies.router';
import { charactersRouter } from './routes/character.routes';
import { equipmentItemsRouter } from './routes/equipmentItem.router';
import { inventoryItemsRouter } from './routes/inventoryItems.router';
import { resultsRouter } from './routes/results.router';
import { itemsRouter } from './routes/items.router';
import { MongoDBHandler } from './mongoDB.handler';
import { Server } from 'http';

export class AppServer {
  mongoDbHandler: MongoDBHandler;
  port = 3000;
  app = express();
  serverListener: Server;

  constructor() {
    this.mongoDbHandler = new MongoDBHandler();
    this.serverListener = new Server();
  }

  getApp() {
    return this.app;
  }

  async start(): Promise<void> {
    this.app.use(express.json());

    this.app.use((_req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, PUT, DELETE, POST');

      next();
    });

    this.setupRouters();

    this.app.all('*', async (req, _res) => {
      throw new NotFoundError(`Route ${req.url} does not exist.`);
    });

    this.app.use(errorHandler);


    await this.connectDb();


    this.serverListener = this.app.listen(this.port, () => {
      console.log('The application is listening on port http://localhost:' + this.port);
    })

    process.on('SIGINT', () => {
      this.destroy().then(() => {
        console.log('Closing application');
        process.exit(2)
      });
    })
  }

  async connectDb() {
    const nodeEnv = process.env.NODE_ENV ?? 'dev';
    return await this.mongoDbHandler.connect(nodeEnv);
  }

  setupRouters() {
    this.app.use('/api/v1/accounts', accountsRouter);
    this.app.use('/api/v1/characters', charactersRouter);
    this.app.use('/api/v1/adventures', adventuresRouter);
    this.app.use('/api/v1/results', resultsRouter);
    this.app.use('/api/v1/inventory-items', inventoryItemsRouter);
    this.app.use('/api/v1/attributes', attributesRouter);
    this.app.use('/api/v1/character-attributes', characterAttributesRouter);
    this.app.use('/api/v1/character-currencies', characterCurrenciesRouter);
    this.app.use('/api/v1/equipment-items', equipmentItemsRouter);
    this.app.use('/api/v1/items', itemsRouter);
  }

  async destroy(): Promise<void> {
    await Promise.all([this.serverListener.close(), this.mongoDbHandler.disconnect()])
    // await this.closeServer();
    // await this.mongoDbHandler.disconnect();
  }
}

if (process.env.NODE_ENV !== 'test') {
  const server = new AppServer();
  void server.start();
}

