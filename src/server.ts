import express, { Request, Response } from 'express';
import { Server } from 'http';

import { errorHandler } from './middleware/errorHandler';
import { accountsRouter } from './routes/account.routes';
import { adventuresRouter } from './routes/adventure.routes';
import { attributesRouter } from './routes/attribute.routes';
import { characterAttributesRouter } from './routes/characterAttribute.routes';
import { characterCurrenciesRouter } from './routes/characterCurrency.routes';
import { charactersRouter } from './routes/character.routes';
import { characterEquipmentRouter } from './routes/characterEquipment.routes';
import { inventoryRouter } from './routes/inventory.routes';
import { itemsRouter } from './routes/item.routes';
import { MongoDBHandler } from './mongoDB.handler';
import { BasePaths, ApiRoutes } from '../../shared/src';
import { rewardsRouter } from './routes/reward.routes';

export const PUBLIC_ROUTES = {
  Accounts: `/${BasePaths.PUBLIC}/${ApiRoutes.ACCOUNTS}`,
  Characters: `/${BasePaths.PUBLIC}/${ApiRoutes.CHARACTERS}`,
  Adventures: `/${BasePaths.PUBLIC}/${ApiRoutes.ADVENTURES}`,
  Results: `/${BasePaths.PUBLIC}/${ApiRoutes.RESULTS}`,
  Inventory: `/${BasePaths.PUBLIC}/${ApiRoutes.INVENTORY}`,
  Attributes: `/${BasePaths.PUBLIC}/${ApiRoutes.ATTRIBUTES}`,
  CharacterAttributes: `/${BasePaths.PUBLIC}/${ApiRoutes.CHARACTER_ATTRIBUTES}`,
  CharacterCurrencies: `/${BasePaths.PUBLIC}/${ApiRoutes.CHARACTER_CURRENCIES}`,
  CharacterEquipment: `/${BasePaths.PUBLIC}/${ApiRoutes.CHARACTER_EQUIPMENT}`,
  Items: `/${BasePaths.PUBLIC}/${ApiRoutes.ITEMS}`,
  Rewards: `/${BasePaths.PUBLIC}/${ApiRoutes.REWARDS}`
};

export class AppServer {
  mongoDbHandler: MongoDBHandler;
  port = process.env.SERVER_PORT;
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
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );
      res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, PUT, DELETE, POST'
      );

      next();
    });

    this.setupPublicRouters();

    this.app.all('*', (req: Request, res: Response) => {
      return res.status(404).json({
        success: false,
        error: `Route ${req.url} does not exist.`
      });
    });

    this.app.use(errorHandler);

    await this.connectDb();

    this.serverListener = this.app.listen(this.port, () => {
      console.log(
        'The application is listening on port http://localhost:' + this.port
      );
    });

    process.on('SIGINT', () => {
      this.destroy().then(() => {
        console.log('Closing application');
        process.exit(2);
      });
    });
  }

  async connectDb() {
    const nodeEnv = process.env.NODE_ENV ?? 'dev';
    return await this.mongoDbHandler.connect(nodeEnv);
  }

  setupPublicRouters() {
    this.app.use(PUBLIC_ROUTES.Accounts, accountsRouter);
    this.app.use(PUBLIC_ROUTES.Characters, charactersRouter);
    this.app.use(PUBLIC_ROUTES.Adventures, adventuresRouter);
    this.app.use(PUBLIC_ROUTES.Inventory, inventoryRouter);
    this.app.use(PUBLIC_ROUTES.Attributes, attributesRouter);
    this.app.use(PUBLIC_ROUTES.CharacterAttributes, characterAttributesRouter);
    this.app.use(PUBLIC_ROUTES.CharacterCurrencies, characterCurrenciesRouter);
    this.app.use(PUBLIC_ROUTES.CharacterEquipment, characterEquipmentRouter);
    this.app.use(PUBLIC_ROUTES.Items, itemsRouter);
    this.app.use(PUBLIC_ROUTES.Rewards, rewardsRouter);
  }

  async destroy(): Promise<void> {
    await Promise.all([
      this.serverListener.close(),
      this.mongoDbHandler.disconnect()
    ]);
  }
}

if (process.env.NODE_ENV !== 'test') {
  const server = new AppServer();
  void server.start();
}
