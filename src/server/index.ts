import { AxiosRequestConfig } from 'axios';
import serverConnectionSingleton from './ServerConnection';

const config: AxiosRequestConfig = {
  baseURL: '/api',
};

serverConnectionSingleton.getInstance(config);
