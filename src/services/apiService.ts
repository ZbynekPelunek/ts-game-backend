import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BasePaths, ApiRoutes } from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler.middleware';
import { AccountService } from './account.service';
import { CharacterService } from './character.service';
import { AdventureService } from './adventure.service';
import { ResultService } from './result.service';
import { CharacterAttributeService } from './characterAttribute.service';

export const V1_ROUTES = {
  Accounts: `/${BasePaths.V1}/${ApiRoutes.ACCOUNTS}`,
  Characters: `/${BasePaths.V1}/${ApiRoutes.CHARACTERS}`,
  Adventures: `/${BasePaths.V1}/${ApiRoutes.ADVENTURES}`,
  Results: `/${BasePaths.V1}/${ApiRoutes.RESULTS}`,
  Inventory: `/${BasePaths.V1}/${ApiRoutes.INVENTORY}`,
  CharacterAttributes: `/${BasePaths.V1}/${ApiRoutes.CHARACTER_ATTRIBUTES}`,
  CharacterCurrencies: `/${BasePaths.V1}/${ApiRoutes.CHARACTER_CURRENCIES}`,
  CharacterEquipment: `/${BasePaths.V1}/${ApiRoutes.CHARACTER_EQUIPMENT}`,
  Auth: `/${BasePaths.V1}/${ApiRoutes.AUTH}`
};

export const INTERNAL_ROUTES = {
  Accounts: `/${BasePaths.INTERNAL}/${ApiRoutes.ACCOUNTS}`,
  Attributes: `/${BasePaths.INTERNAL}/${ApiRoutes.ATTRIBUTES}`,
  CharacterAttributes: `/${BasePaths.INTERNAL}/${ApiRoutes.CHARACTER_ATTRIBUTES}`,
  CharacterCurrencies: `/${BasePaths.INTERNAL}/${ApiRoutes.CHARACTER_CURRENCIES}`,
  CharacterEquipment: `/${BasePaths.INTERNAL}/${ApiRoutes.CHARACTER_EQUIPMENT}`,
  Currencies: `/${BasePaths.INTERNAL}/${ApiRoutes.CURRENCIES}`,
  Enemies: `/${BasePaths.INTERNAL}/${ApiRoutes.ENEMIES}`,
  Inventory: `/${BasePaths.INTERNAL}/${ApiRoutes.INVENTORY}`,
  Items: `/${BasePaths.INTERNAL}/${ApiRoutes.ITEMS}`,
  Rewards: `/${BasePaths.INTERNAL}/${ApiRoutes.REWARDS}`
};

/* export const FULL_V1_ROUTES = {
  Accounts: `${process.env.SERVER_URL}${V1_ROUTES.Accounts}`,
  Characters: `${process.env.SERVER_URL}${V1_ROUTES.Characters}`,
  Adventures: `${process.env.SERVER_URL}${V1_ROUTES.Adventures}`,
  Results: `${process.env.SERVER_URL}${V1_ROUTES.Results}`,
  Inventory: `${process.env.SERVER_URL}${V1_ROUTES.Inventory}`,
  Attributes: `${process.env.SERVER_URL}${V1_ROUTES.Attributes}`,
  CharacterAttributes: `${process.env.SERVER_URL}${V1_ROUTES.CharacterAttributes}`,
  CharacterCurrencies: `${process.env.SERVER_URL}${V1_ROUTES.CharacterCurrencies}`,
  CharacterEquipment: `${process.env.SERVER_URL}${V1_ROUTES.CharacterEquipment}`,
  Items: `${process.env.SERVER_URL}${V1_ROUTES.Items}`,
  Rewards: `${process.env.SERVER_URL}${V1_ROUTES.Rewards}`,
  Enemies: `${process.env.SERVER_URL}${V1_ROUTES.Enemies}`,
}; */

export class ApiService {
  public accountService: AccountService;
  public characterService: CharacterService;
  public adventureService: AdventureService;
  public resultService: ResultService;
  public characterAttributeService: CharacterAttributeService;

  constructor() {
    this.accountService = new AccountService();
    this.characterService = new CharacterService();
    this.adventureService = new AdventureService();
    this.resultService = new ResultService();
    this.characterAttributeService = new CharacterAttributeService();
  }

  private async makeRequest<T>(
    method: 'get' | 'post' | 'patch' | 'delete',
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const basePath = process.env.SERVER_URL;
      if (!basePath) {
        throw new CustomError('Base path is empty', 500);
      }

      let apiResponse: AxiosResponse<T>;
      if (method === 'get') {
        apiResponse = await axios.get(basePath + path, config);
      } else {
        apiResponse = await axios[method](basePath + path, data, config);
      }

      return apiResponse.data;
    } catch (error: any) {
      console.error('Axios Error with request method: ', method.toUpperCase());
      throw new CustomError(
        `${error.response.data.error}`,
        error.response.status
      );
    }
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('get', path, undefined, config);
  }

  async post<T, D>(
    path: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.makeRequest<T>('post', path, data, config);
  }

  async patch<T, D>(path: string, data: D): Promise<T> {
    return this.makeRequest<T>('patch', path, data);
  }

  async delete<T>(path: string): Promise<T> {
    return this.makeRequest<T>('delete', path);
  }
}
