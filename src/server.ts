import express from 'express';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middleware/errorHandler';
import { accountsRouter } from './routes/account.routes';
import { adventuresRouter } from './routes/adventures.router';
import { attributesRouter } from './routes/attribute.routes';
import { characterAttributesRouter } from './routes/characterAttribute.routes';
import { characterCurrenciesRouter } from './routes/characterCurrency.routes';
import { charactersRouter } from './routes/character.routes';
import { characterEquipmentRouter } from './routes/characterEquipment.routes';
import { inventoryItemsRouter } from './routes/inventoryItem.routes';
import { resultsRouter } from './routes/results.router';
import { itemsRouter } from './routes/item.routes';
import { MongoDBHandler } from './mongoDB.handler';
import { Server } from 'http';
import { ApiRoutes, Paths } from '../../shared/src';

export const PUBLIC_ROUTES = {
  Accounts: `/${Paths.PUBLIC}/${ApiRoutes.ACCOUNTS}`,
  Characters: `/${Paths.PUBLIC}/${ApiRoutes.CHARACTERS}`,
  Adventures: `/${Paths.PUBLIC}/${ApiRoutes.ADVENTURES}`,
  Results: `/${Paths.PUBLIC}/${ApiRoutes.RESULTS}`,
  Inventory: `/${Paths.PUBLIC}/${ApiRoutes.INVENTORY}`,
  Attributes: `/${Paths.PUBLIC}/${ApiRoutes.ATTRIBUTES}`,
  CharacterAttributes: `/${Paths.PUBLIC}/${ApiRoutes.CHARACTER_ATTRIBUTES}`,
  CharacterCurrencies: `/${Paths.PUBLIC}/${ApiRoutes.CHARACTER_CURRENCIES}`,
  CharacterEquipment: `/${Paths.PUBLIC}/${ApiRoutes.CHARACTER_EQUIPMENT}`,
  Items: `/${Paths.PUBLIC}/${ApiRoutes.ITEMS}`
}

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
    this.app.use(PUBLIC_ROUTES.Accounts, accountsRouter);
    this.app.use(PUBLIC_ROUTES.Characters, charactersRouter);
    this.app.use(PUBLIC_ROUTES.Adventures, adventuresRouter);
    this.app.use(PUBLIC_ROUTES.Results, resultsRouter);
    this.app.use(PUBLIC_ROUTES.Inventory, inventoryItemsRouter);
    this.app.use(PUBLIC_ROUTES.Attributes, attributesRouter);
    this.app.use(PUBLIC_ROUTES.CharacterAttributes, characterAttributesRouter);
    this.app.use(PUBLIC_ROUTES.CharacterCurrencies, characterCurrenciesRouter);
    this.app.use(PUBLIC_ROUTES.CharacterEquipment, characterEquipmentRouter);
    this.app.use(PUBLIC_ROUTES.Items, itemsRouter);
  }

  async destroy(): Promise<void> {
    await Promise.all([this.serverListener.close(), this.mongoDbHandler.disconnect()])
  }
}

if (process.env.NODE_ENV !== 'test') {
  const server = new AppServer();
  void server.start();
}

