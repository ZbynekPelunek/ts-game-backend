import express, { Application, Request, Response } from 'express';
import { Server } from 'http';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { adventuresV1Router } from './routes/v1/adventure.v1.routes';
import { attributesInternalRouter } from './routes/internal/attribute.internal.routes';
import { characterAttributesV1Router } from './routes/v1/characterAttribute.v1.routes';
import { characterCurrenciesV1Router } from './routes/v1/characterCurrency.v1.routes';
import { characterEquipmentV1Router } from './routes/v1/characterEquipment.v1.routes';
import { inventoryV1Router } from './routes/v1/inventory.v1.routes';
import { itemsInternalRouter } from './routes/internal/item.internal.routes';
import { MongoDBHandler } from './mongoDB.handler';
import { rewardsInternalRouter } from './routes/internal/reward.internal.routes';
import { enemiesInternalRouter } from './routes/internal/enemy.internal.routes';
import { resultsV1Router } from './routes/v1/result.v1.routes';
import { readConfigFile } from './utils/setupConfig';
import { errorHandler } from './middleware/errorHandler.middleware';
import { currenciesInternalRouter } from './routes/internal/currency.internal.routes';
import { accountsV1Router } from './routes/v1/account.v1.routes';
import { INTERNAL_ROUTES, V1_ROUTES } from './services/apiService';
import { accountsInternalRouter } from './routes/internal/account.internal.routes';
import { authV1Router } from './routes/v1/auth.v1.routes';
import { characterV1Router } from './routes/v1/character.v1.routes';

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
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || 'http://127.0.0.1:4200',
        credentials: true
      })
    );
    this.app.use(express.urlencoded());

    this.initPublicRouters();
    this.initInternalRouters();
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
    this.app.use(V1_ROUTES.Auth, authV1Router);
    this.app.use(V1_ROUTES.Accounts, accountsV1Router);
    this.app.use(V1_ROUTES.Characters, characterV1Router);
    this.app.use(V1_ROUTES.Adventures, adventuresV1Router);
    this.app.use(V1_ROUTES.Inventory, inventoryV1Router);
    this.app.use(V1_ROUTES.CharacterAttributes, characterAttributesV1Router);
    this.app.use(V1_ROUTES.CharacterCurrencies, characterCurrenciesV1Router);
    this.app.use(V1_ROUTES.CharacterEquipment, characterEquipmentV1Router);
    this.app.use(V1_ROUTES.Results, resultsV1Router);
  }

  private initInternalRouters(): void {
    this.app.use(INTERNAL_ROUTES.Accounts, accountsInternalRouter);
    this.app.use(INTERNAL_ROUTES.Attributes, attributesInternalRouter);
    this.app.use(
      INTERNAL_ROUTES.CharacterAttributes,
      characterAttributesV1Router
    );
    this.app.use(
      INTERNAL_ROUTES.CharacterCurrencies,
      characterCurrenciesV1Router
    );
    this.app.use(
      INTERNAL_ROUTES.CharacterEquipment,
      characterEquipmentV1Router
    );
    this.app.use(INTERNAL_ROUTES.Currencies, currenciesInternalRouter);
    this.app.use(INTERNAL_ROUTES.Enemies, enemiesInternalRouter);
    this.app.use(INTERNAL_ROUTES.Inventory, inventoryV1Router);
    this.app.use(INTERNAL_ROUTES.Items, itemsInternalRouter);
    this.app.use(INTERNAL_ROUTES.Rewards, rewardsInternalRouter);
  }

  private handleSIGINT(): void {
    process.on('SIGINT', () => this.destroy());
  }
}

if (process.env.NODE_ENV !== 'test') {
  const server = new AppServer();
  void server.start();
}
