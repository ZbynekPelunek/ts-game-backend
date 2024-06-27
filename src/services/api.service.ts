import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BasePaths, ApiRoutes } from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler';

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

/* export const FULL_PUBLIC_ROUTES = {
  Accounts: `${process.env.SERVER_URL}${PUBLIC_ROUTES.Accounts}`,
  Characters: `${process.env.SERVER_URL}${PUBLIC_ROUTES.Characters}`,
  Adventures: `${process.env.SERVER_URL}${PUBLIC_ROUTES.Adventures}`,
  Results: `${process.env.SERVER_URL}${PUBLIC_ROUTES.Results}`,
  Inventory: `${process.env.SERVER_URL}${PUBLIC_ROUTES.Inventory}`,
  Attributes: `${process.env.SERVER_URL}${PUBLIC_ROUTES.Attributes}`,
  CharacterAttributes: `${process.env.SERVER_URL}${PUBLIC_ROUTES.CharacterAttributes}`,
  CharacterCurrencies: `${process.env.SERVER_URL}${PUBLIC_ROUTES.CharacterCurrencies}`,
  CharacterEquipment: `${process.env.SERVER_URL}${PUBLIC_ROUTES.CharacterEquipment}`,
  Items: `${process.env.SERVER_URL}${PUBLIC_ROUTES.Items}`,
  Rewards: `${process.env.SERVER_URL}${PUBLIC_ROUTES.Rewards}`,
  Enemies: `${process.env.SERVER_URL}${PUBLIC_ROUTES.Enemies}`,
}; */

export class ApiService {
  private async makeRequest<T>(
    method: 'get' | 'post' | 'patch' | 'delete',
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const basePath = process.env.SERVER_URL;
      if (!basePath) {
        throw new CustomError('Base path is empty', 500);
      }
      const apiResponse: AxiosResponse<T> = await axios[method](
        basePath + path,
        data,
        config
      );
      return apiResponse.data;
    } catch (error) {
      throw new Error(`Error in ${method.toUpperCase()} request: ${error}`);
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
