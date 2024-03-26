import { AppServer, PUBLIC_ROUTES } from '../server';
import { Express } from 'express-serve-static-core';
import axios from 'axios';
import { Response_Attributes_GET_all, Response_CharacterAttributes_POST, Response_CharacterEquipment_POST, Response_Inventories_POST } from '../../../shared/src';
import { Types } from 'mongoose';
import { InventoryActions } from '../routes/inventoryItem.routes';

jest.mock('axios');

export const mockedAxios = jest.mocked(axios);

export let APP_SERVER: Express;
let appServer: AppServer;

export const unknownID = new Types.ObjectId;

beforeAll(async () => {
  appServer = new AppServer();
  appServer.start();
  appServer.setupPublicRouters();
  APP_SERVER = appServer.getApp();

  mockedAxios.get.mockImplementation((url) => {
    if (url === 'http://localhost:3000/api/v1/attributes') {
      return Promise.resolve<{ data: Response_Attributes_GET_all }>({ data: { success: true, attributes: [] } })
    }
    return Promise.resolve({ data: [] })
  });

  mockedAxios.post.mockImplementation((url) => {
    console.log('mockedAxios POST url: ', url);
    switch (url) {
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterAttributes}`:
        return Promise.resolve<{ data: Response_CharacterAttributes_POST }>({ data: { success: true, characterAttributes: [] } });
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterCurrencies}`:
        return Promise.resolve({ data: { success: true, characterCurrencies: [] } });
      case `http://localhost:3000${PUBLIC_ROUTES.CharacterEquipment}`:
        return Promise.resolve<{ data: Response_CharacterEquipment_POST }>({ data: { success: true, characterEquipment: [] } });
      case `http://localhost:3000${PUBLIC_ROUTES.Inventory}?action=${InventoryActions.NEW}`:
        return Promise.resolve<{ data: Response_Inventories_POST }>({ data: { success: true, inventoryItems: [] } });
      default:
        return Promise.resolve({ data: [] })
    }
  });
});

afterAll(async () => {
  await appServer.destroy();
});