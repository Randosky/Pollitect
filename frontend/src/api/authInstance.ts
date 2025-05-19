/* eslint-disable camelcase */
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { FORBIDDEN_CODE } from "@/config";

const baseURL = import.meta.env.VITE_API_URL;

/** Создаем экземпляр Axios для авторизации */
const authAxiosInstance = axios.create({
  baseURL: `${baseURL}/auth`,
  withCredentials: true,
});

/** Устанавливаем заголовки для каждого запроса */
const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  config.headers["Content-Type"] = "application/json";
  config.headers.Accept = "application/json";

  return config;
};

/** Устанавливаем accessToken в sessionStorage после запроса */
authAxiosInstance.interceptors.response.use(
  response => {
    const {
      data: { accessToken },
    } = response;

    if (typeof accessToken === "string") {
      sessionStorage.setItem("accessToken", accessToken);
    }

    return response;
  },
  async (error: AxiosError) => {
    const { response } = error;

    if (
      response?.status === FORBIDDEN_CODE ||
      (response?.data as { message?: string })?.message === "Токен отсутствует"
    ) {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");
      window.location.reload();

      return;
    }

    // Пробрасываем оригинальную ошибку
    return Promise.reject(error);
  }
);

authAxiosInstance.interceptors.request.use(authInterceptor);

export default authAxiosInstance;
