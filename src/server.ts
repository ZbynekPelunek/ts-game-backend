import express, { Application, Request, Response } from 'express';
import { Server } from 'http';

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
import { enemiesRouter } from './routes/enemy.routes';
import { resultsRouter } from './routes/result.routes';
import { readConfigFile } from './utils/setupConfig';
import { corsMiddleware } from './middleware/corsMiddleware';

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
  Rewards: `/${BasePaths.PUBLIC}/${ApiRoutes.REWARDS}`,
  Enemies: `/${BasePaths.PUBLIC}/${ApiRoutes.ENEMIES}`,
};

export class AppServer {
  private mongoDbHandler: MongoDBHandler;
  private serverPort = 3000;
  private app: Application;
  private server: Server;

  constructor() {
    this.app = express();
    this.mongoDbHandler = new MongoDBHandler();
    this.server = new Server();
  }

  getApp(): Application {
    return this.app;
  }

  async start(): Promise<void> {
    try {
      await this.initConfig();
      await this.initServer();
      await this.connectDb();
    } catch (error) {
      console.error('Error while starting application: ', error);
      await this.destroy();
      process.exit(2);
    }
  }

  async destroy(): Promise<void> {
    try {
      await Promise.all([
        this.server.close(),
        this.mongoDbHandler.disconnect(),
      ]);
    } catch (error) {
      console.error('Error while shutting down server: ', error);
    }
  }

  private async initConfig(): Promise<void> {
    const config = await readConfigFile();
    this.serverPort = config.server.port ?? this.serverPort;
    process.env.SERVER_URL = `${config.server.protocol}://${config.server.baseUrl}:${this.serverPort}`;
    process.env.FRONTEND_URL = `${config.frontend.protocol}://${config.frontend.baseUrl}:${config.frontend.port}`;
  }

  private async initServer(): Promise<void> {
    this.app.use(express.json());
    this.app.use(corsMiddleware);
    this.initPublicRouters();
    this.app.all('*', (req: Request, res: Response) => {
      return res.status(404).json({
        success: false,
        error: `Route ${req.url} does not exist.`,
      });
    });
    this.server = this.app.listen(this.serverPort, () => {
      console.log(`The application is listening on ${process.env.SERVER_URL}`);
    });
    this.handleSIGINT();
  }

  private async connectDb(): Promise<void> {
    const nodeEnv = process.env.NODE_ENV ?? 'dev';
    await this.mongoDbHandler.connect(nodeEnv);
  }

  private initPublicRouters(): void {
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
    this.app.use(PUBLIC_ROUTES.Enemies, enemiesRouter);
    this.app.use(PUBLIC_ROUTES.Results, resultsRouter);
  }

  private handleSIGINT(): void {
    process.on('SIGINT', () => this.destroy());
  }
}

if (process.env.NODE_ENV !== 'test') {
  const server = new AppServer();
  void server.start();
}
