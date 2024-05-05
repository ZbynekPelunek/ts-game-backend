import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BasePaths, ApiRoutes } from '../../../shared/src';

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

export const FULL_PUBLIC_ROUTES = {
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
};

export class ApiService {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const apiResponse: AxiosResponse<T> = await axios.get(url, config);
      console.log('GET API Response:', apiResponse.data);
      return apiResponse.data;
    } catch (error) {
      console.error('Error calling GET API:', error);
      throw error;
    }
  }

  async post<T, D>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const apiResponse = await axios.post<T>(url, data, config);
      console.log('POST API Response:', apiResponse.data);
      return apiResponse.data;
    } catch (error) {
      console.error('Error calling POST API:', error);
      throw error;
    }
  }

  async patch<T, D>(url: string, data: D): Promise<T> {
    try {
      const apiResponse: AxiosResponse<T> = await axios.patch(url, data);
      console.log('PATCH API Response:', apiResponse.data);
      return apiResponse.data;
    } catch (error) {
      console.error('Error calling PATCH API:', error);
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const apiResponse: AxiosResponse<T> = await axios.delete(url);
      console.log('DELETE API Response:', apiResponse.data);
      return apiResponse.data;
    } catch (error) {
      console.error('Error calling DELETE API:', error);
      throw error;
    }
  }
}
