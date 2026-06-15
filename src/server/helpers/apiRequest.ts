import serverConnectionSingleton from '@/server/ServerConnection';
import { AxiosRequestConfig, isAxiosError } from 'axios';

export default async function apiRequest<TPayload, TResponse>(
  url: string,
  method: 'get' | 'delete' | 'post' | 'put' | 'patch',
  payload?: TPayload,
  axiosConfigOverride: AxiosRequestConfig = {}
): Promise<TResponse> {
  try {
    const config: AxiosRequestConfig = {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api',
      ...axiosConfigOverride,
    };

    const serverConnectionInstance =
      serverConnectionSingleton.getInstance(config);
    const response = await serverConnectionInstance.request<TResponse>({
      url: url,
      method: method,
      data: payload,
      ...axiosConfigOverride,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as any;
      if (data) {
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.message) {
          throw new Error(data.message);
        }
      }
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
}
