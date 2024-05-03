import axios from 'axios';
import { Application } from 'express';
import { Types } from 'mongoose';
import { afterAll, beforeAll, jest } from '@jest/globals';

import { AppServer, PUBLIC_ROUTES } from '../server';
import {
  Response_Attribute_GET_all,
  Response_CharacterEquipment_POST,
  Response_CharacterAttribute_POST,
  Response_Inventory_POST,
  Response_CharacterCurrency_POST,
  Response_CharacterAttribute_GET_all,
  Response_CharacterCurrency_GET_all,
  Response_CharacterEquipment_GET_all,
  Response_Inventory_GET_all,
  Response_Adventure_GET_all,
} from '../../../shared/src';

jest.mock('axios');

export const mockedAxios = jest.mocked(axios);

export let APP_SERVER: Application;
let appServer: AppServer;

export const UNKNOWN_OBJECT_ID = new Types.ObjectId();

beforeAll(() => {
  appServer = new AppServer();
  appServer.start();
  APP_SERVER = appServer.getApp();

  mockedAxios.get.mockImplementation((url: string) => {
    switch (url) {
      case `http://localhost:3000${PUBLIC_ROUTES.Adventures}`:
        return Promise.resolve<{ data: Response_Adventure_GET_all }>({
          data: { success: true, adventures: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.Attributes}`:
        return Promise.resolve<{ data: Response_Attribute_GET_all }>({
          data: { success: true, attributes: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterAttributes}`:
        return Promise.resolve<{ data: Response_CharacterAttribute_GET_all }>({
          data: { success: true, characterAttributes: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterCurrencies}`:
        return Promise.resolve<{ data: Response_CharacterCurrency_GET_all }>({
          data: { success: true, characterCurrencies: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterEquipment}`:
        return Promise.resolve<{
          data: Response_CharacterEquipment_GET_all;
        }>({
          data: { success: true, characterEquipment: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.Inventory}`:
        return Promise.resolve<{ data: Response_Inventory_GET_all }>({
          data: { success: true, inventory: [] },
        });
      default:
        return Promise.resolve<any>({ data: [] });
    }
  });

  mockedAxios.post.mockImplementation((url: string) => {
    //console.log('mockedAxios POST url: ', url);
    switch (url) {
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterAttributes}`:
        return Promise.resolve<{ data: Response_CharacterAttribute_POST }>({
          data: { success: true, characterAttributes: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterCurrencies}`:
        return Promise.resolve<{ data: Response_CharacterCurrency_POST }>({
          data: { success: true, characterCurrencies: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterEquipment}`:
        return Promise.resolve<{
          data: Response_CharacterEquipment_POST;
        }>({
          data: { success: true, characterEquipment: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.Inventory}`:
        return Promise.resolve<{ data: Response_Inventory_POST }>({
          data: { success: true, inventory: [] },
        });
      default:
        return Promise.resolve<any>({ data: [] });
    }
  });
});

afterAll(async () => {
  await appServer.destroy();
});
