import { connect, Mongoose, startSession } from 'mongoose';

import { AccountModel } from './models/account.model';
import { CharacterModel } from './models/character.model';
import { CharacterAttributeModel } from './models/characterAttribute';
import { CharacterCurrencyModel } from './models/characterCurrency.model';
import { CharacterEquipmentModel } from './models/characterEquipment';
import { ResultModel } from './models/result.model';

export const startTransaction = () => {
  return startSession();
};

export class MongoDBHandler {
  connection: Mongoose | undefined;

  public async connect(nodeEnv: string) {
    let uri = 'mongodb://127.0.0.1:27017';
    try {
      switch (nodeEnv) {
        case 'test':
          uri = uri + '/test';
          break;
        case 'dev':
          uri = uri + '/dev';
          break;
        default:
          uri = process.env.MONGOOSE_URI ?? uri + '/unknown';
      }
      this.connection = await connect(uri);
      console.log('Connected to MongoDB');
      return this.connection;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await this.cleanUpCollections();
    return await this.connection?.disconnect();
  }

  private async cleanUpCollections() {
    console.log('Cleaning database...');

    // console.log('cleaning accounts...');
    // await AccountModel.deleteMany({});
    // console.log('...accounts cleaned.');

    // console.log('cleaning characters...');
    // await CharacterModel.deleteMany({});
    // console.log('...characters cleaned.');

    // console.log('cleaning character attributes...');
    // await CharacterAttributeModel.deleteMany({});
    // console.log('...character attributes cleaned.');

    // console.log('cleaning character currencies...');
    // await CharacterCurrencyModel.deleteMany({});
    // console.log('...character currencies cleaned.');

    // console.log('cleaning character equipment items...');
    // await CharacterEquipmentModel.deleteMany({});
    // console.log('...character equipment items cleaned.');

    await Promise.all([
      AccountModel.deleteMany({}),
      CharacterModel.deleteMany({}),
      CharacterAttributeModel.deleteMany({}),
      CharacterCurrencyModel.deleteMany({}),
      CharacterEquipmentModel.deleteMany({}),
      ResultModel.deleteMany({}),
    ]);
    console.log('...cleaning database done.');
  }
}
