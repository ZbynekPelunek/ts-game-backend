import express, { Application, Request, Response } from 'express';
import { Server } from 'http';
import helmet from 'helmet';
import cors from 'cors';

import { accountsRouter } from './routes/account.routes';
import { adventuresRouter } from './routes/adventure.routes';
import { attributesRouter } from './routes/attribute.routes';
import { characterAttributesRouter } from './routes/characterAttribute.routes';
import { characterCurrenciesRouter } from './routes/characterCurrency.routes';
import { characterEquipmentRouter } from './routes/characterEquipmentRoutes';
import { inventoryRouter } from './routes/inventory.routes';
import { itemsRouter } from './routes/item.routes';
import { MongoDBHandler } from './mongoDB.handler';
import { rewardsRouter } from './routes/rewardRoutes';
import { enemiesRouter } from './routes/enemyRoutes';
import { resultsRouter } from './routes/result.routes';
import { readConfigFile } from './utils/setupConfig';
import { corsMiddleware } from './middleware/corsMiddleware';
import { PUBLIC_ROUTES } from './services/apiService';
import { errorHandler } from './middleware/errorHandler';
import { CharacterRoutes } from './routes/character.routes';
import { currenciesRouter } from './routes/currency.routes';

export class AppServer {
  private mongoDbHandler: MongoDBHandler;
  private serverPort = 3000;
  private app: Application;
  private server: Server;
  private serverUrl = '';

  constructor() {
    this.app = express();
    this.mongoDbHandler = new MongoDBHandler();
    this.server = new Server();
  }

  getApp(): Application {
    return this.app;
  }

  getServerUrl(): string {
    return this.serverUrl;
  }

  async start(): Promise<void> {
    try {
      await this.initConfig();
      await this.initServer();
      console.log('process.env.SERVER_URL: ', process.env.SERVER_URL);
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
        this.mongoDbHandler.disconnect()
      ]);
    } catch (error) {
      console.error('Error while shutting down server: ', error);
    }
  }

  private async initConfig(): Promise<void> {
    const config = await readConfigFile();
    this.serverPort = config.server.port ?? this.serverPort;
    this.serverUrl = `${config.server.protocol}://${config.server.baseUrl}:${this.serverPort}`;
    process.env.SERVER_URL = this.serverUrl;
    process.env.FRONTEND_URL = `${config.frontend.protocol}://${config.frontend.baseUrl}:${config.frontend.port}`;
  }

  private async initServer(): Promise<void> {
    this.app.use(helmet());
    //this.app.use(corsMiddleware);
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || 'http://127.0.0.1:4200',
        credentials: true
      })
    );
    this.app.use(express.urlencoded());

    this.initPublicRouters();
    this.app.all(/(.*)/, (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: `Route ${req.url} does not exist.`
      });
    });
    this.app.use(errorHandler);
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
    const characterRouter = new CharacterRoutes();
    const charactersRouter = characterRouter.getRouter();
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
    this.app.use(PUBLIC_ROUTES.Currencies, currenciesRouter);
  }

  private handleSIGINT(): void {
    process.on('SIGINT', () => this.destroy());
  }
}

if (process.env.NODE_ENV !== 'test') {
  const server = new AppServer();
  void server.start();
}
