import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { auth } from '@/utils/firebase';
import { User } from 'firebase/auth';
import Cookies from 'js-cookie';
import { logger } from '@/lib/loggers';

class serverConnectionSingleton {
  private static instance: AxiosInstance;
  private static authInitializedPromise: Promise<User | null>;

  private constructor() {}

  public static getInstance(config?: AxiosRequestConfig) {
    if (!this.instance && !config) {
      throw new Error('No instance to return and no config to setup.');
    }

    if (!this.instance) {
      this.instance = axios.create({
        baseURL: config?.baseURL,
        withCredentials: true,
      });

      this.authInitializedPromise = new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          resolve(user);
          unsubscribe();
        });
      });

      this.setupInterceptors();
    } else if (config) {
      this.instance.defaults.baseURL =
        config.baseURL || this.instance.defaults.baseURL;
      this.instance.defaults.withCredentials = true;
    }

    return this.instance;
  }

  private static setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        await serverConnectionSingleton.authInitializedPromise;
        const currentUser = auth.currentUser;

        if (currentUser) {
          try {
            const token = await currentUser.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          } catch (error) {
            logger.error('Error getting ID token:', error);
            const cookieToken = Cookies.get('auth-token');
            if (cookieToken) {
              config.headers.Authorization = `Bearer ${cookieToken}`;
            }
          }
        } else {
          const cookieToken = Cookies.get('auth-token');
          if (cookieToken) {
            config.headers.Authorization = `Bearer ${cookieToken}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logger.error(
            'Unauthorized access - possibly expired token or no token.'
          );
          Cookies.remove('auth-token');
        }
        return Promise.reject(error);
      }
    );
  }
}

export default serverConnectionSingleton;
