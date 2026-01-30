import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import Cookies from "js-cookie";
import { logger } from "@/lib/loggers";

class serverConnectionSingleton {
  private static instance: AxiosInstance;
  private static authInitializedPromise: Promise<User | null>;

  private constructor() {}

  public static getInstance(config?: AxiosRequestConfig) {
    if (!this.instance && !config) {
      throw new Error("No instance to return and no config to setup.");
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
            const tokenResult = await currentUser.getIdTokenResult();
            const tokenAge =
              Date.now() - new Date(tokenResult.authTime).getTime();
            const shouldRefresh = tokenAge > 55 * 60 * 1000;

            const token = await currentUser.getIdToken(shouldRefresh);

            if (shouldRefresh) {
              Cookies.set("auth-token", token, {
                expires: 7,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
              });
            }

            config.headers.Authorization = `Bearer ${token}`;
          } catch (error) {
            logger.error("Error getting ID token:", error);
            const cookieToken = Cookies.get("auth-token");
            if (cookieToken) {
              config.headers.Authorization = `Bearer ${cookieToken}`;
            }
          }
        } else {
          const cookieToken = Cookies.get("auth-token");
          if (cookieToken) {
            config.headers.Authorization = `Bearer ${cookieToken}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const currentUser = auth.currentUser;

          if (currentUser) {
            try {
              const token = await currentUser.getIdToken(true);

              Cookies.set("auth-token", token, {
                expires: 7,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
              });

              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.instance(originalRequest);
            } catch (refreshError) {
              logger.error("Token refresh failed:", refreshError);
              Cookies.remove("auth-token");
              if (typeof window !== "undefined") {
                window.location.href =
                  "/signin?redirect=" + window.location.pathname;
              }
            }
          } else {
            logger.error("Unauthorized access - no user logged in.");
            Cookies.remove("auth-token");
            if (typeof window !== "undefined") {
              window.location.href =
                "/signin?redirect=" + window.location.pathname;
            }
          }
        }

        return Promise.reject(error);
      },
    );
  }
}

export default serverConnectionSingleton;
