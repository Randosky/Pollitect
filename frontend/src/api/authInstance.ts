/* eslint-disable camelcase */
import axios, { type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL;

/** Создаем экземпляр Axios для авторизации */
const authAxiosInstance = axios.create({
  baseURL: `${baseURL}/auth`,
});

/** Устанавливаем заголовки для каждого запроса */
const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  config.headers["Content-Type"] = "application/json";
  config.headers.Accept = "application/json";

  return config;
};

/** Устанавливаем accessToken в sessionStorage после запроса */
authAxiosInstance.interceptors.response.use(response => {
  const {
    data: { accessToken },
  } = response;

  if (typeof accessToken === "string") {
    sessionStorage.setItem("accessToken", accessToken);
  }

  return response;
});

authAxiosInstance.interceptors.request.use(authInterceptor);

export default authAxiosInstance;
