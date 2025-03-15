/* eslint-disable camelcase */
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const AUTH_ERROR = 401;
const baseURL = "http://localhost:3000/";

/** Создаем экземпляр Axios для авторизации */
const authAxiosInstance = axios.create({
  baseURL,
});

/** Устанавливаем заголовки для каждого запроса */
const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  config.headers["Content-Type"] = "application/json";
  config.headers.Accept = "application/json";

  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`;
  }

  return config;
};

authAxiosInstance.interceptors.request.use(authInterceptor);

/** Интерсептор для обработки ответов и ошибок */
authAxiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Извлекаем refreshToken
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (originalRequest && refreshToken && error.response?.status === AUTH_ERROR) {
      try {
        const { data: responseData } = await axios.post(`${baseURL}/refresh`, {
          refresh_token: JSON.parse(refreshToken),
        });

        // Сохраняем новый accessToken
        sessionStorage.setItem("accessToken", JSON.stringify(responseData.access_token));

        // Обновляем заголовок авторизации оригинального запроса
        originalRequest.headers.Authorization = `Bearer ${responseData.access_token}`;

        // Повторно отправляем оригинальный запрос с обновленным токеном
        return await authAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Здесь можно добавить логику для обработки ошибки обновления токена
      }
    }

    // Пробрасываем оригинальную ошибку, если это не AUTH_ERROR
    return Promise.reject(error);
  }
);

export default authAxiosInstance;
