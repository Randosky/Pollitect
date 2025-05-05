/* eslint-disable camelcase */
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { FORBIDDEN_CODE } from "@/config";

const AUTH_ERROR = 401;
const baseURL = import.meta.env.VITE_API_URL;

/** Создаем экземпляр Axios для авторизированных запросов на получение данных об опросе */
const userAxiosInstance = axios.create({
  baseURL: `${baseURL}/user`,
  withCredentials: true,
});

/** Устанавливаем заголовки для каждого запроса */
const userInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  config.headers["Content-Type"] = "application/json";
  config.headers.Accept = "application/json";

  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

/** Устанавливаем accessToken в sessionStorage после запроса */
userAxiosInstance.interceptors.response.use(response => {
  const {
    data: { accessToken },
  } = response;

  if (typeof accessToken === "string") {
    sessionStorage.setItem("accessToken", accessToken);
  }

  return response;
});

userAxiosInstance.interceptors.request.use(userInterceptor);

/** Интерсептор для обработки ответов и ошибок */
userAxiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (originalRequest && error.response?.status === AUTH_ERROR) {
      try {
        const { data: responseData } = await axios.post(`${baseURL}/auth/refresh`, null, {
          withCredentials: true,
        });

        // Сохраняем новый accessToken
        sessionStorage.setItem("accessToken", responseData.accessToken);

        // Обновляем заголовок авторизации оригинального запроса
        originalRequest.headers.Authorization = `Bearer ${responseData.accessToken}`;

        // Повторно отправляем оригинальный запрос с обновленным токеном
        return await userAxiosInstance(originalRequest);
      } catch (refreshError) {
        if ((refreshError as AxiosError).status === FORBIDDEN_CODE) {
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("accessToken");
          window.location.reload();
        } else {
          console.error("Token refresh failed:", refreshError);
        }
      }
    }

    // Пробрасываем оригинальную ошибку, если это не AUTH_ERROR
    return Promise.reject(error);
  }
);

export default userAxiosInstance;
