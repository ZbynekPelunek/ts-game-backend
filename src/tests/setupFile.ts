import { Express } from 'express-serve-static-core';
import axios from 'axios';
import { Types } from 'mongoose';
import { afterAll, beforeAll, jest } from '@jest/globals';

import { AppServer, PUBLIC_ROUTES } from '../server';
import {
  Response_Attribute_GET_all,
  Response_CharacterEquipment_POST,
  InventoryActions,
  Response_CharacterAttribute_POST,
  Response_Inventory_POST,
} from '../../../shared/src';

jest.mock('axios');

export const mockedAxios = jest.mocked(axios);

export let APP_SERVER: Express;
let appServer: AppServer;

export const unknownID = new Types.ObjectId();

beforeAll(() => {
  appServer = new AppServer();
  appServer.start();
  appServer.setupPublicRouters();
  APP_SERVER = appServer.getApp();

  // TODO: change 'any' type to:
  // <{ data: Response_Attribute_GET_all }>
  mockedAxios.get.mockImplementation((url: string) => {
    if (url === 'http://localhost:3000/api/v1/attributes') {
      return Promise.resolve<{ data: Response_Attribute_GET_all }>({
        data: { success: true, attributes: [] },
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve<any>({ data: [] });
  });

  mockedAxios.post.mockImplementation((url: string) => {
    console.log('mockedAxios POST url: ', url);
    switch (url) {
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterAttributes}`:
        return Promise.resolve<{ data: Response_CharacterAttribute_POST }>({
          data: { success: true, characterAttributes: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterCurrencies}`:
        return Promise.resolve({
          data: { success: true, characterCurrencies: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterEquipment}`:
        return Promise.resolve<{
          data: Response_CharacterEquipment_POST;
        }>({
          data: { success: true, characterEquipment: [] },
        });
      case `http://localhost:3000${PUBLIC_ROUTES.Inventory}?action=${InventoryActions.NEW}`:
        return Promise.resolve<{ data: Response_Inventory_POST }>({
          data: { success: true, inventory: [] },
        });
      default:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Promise.resolve<any>({ data: [] });
    }
  });
});

afterAll(async () => {
  await appServer.destroy();
});
