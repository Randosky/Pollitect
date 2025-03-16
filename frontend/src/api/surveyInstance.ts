/* eslint-disable camelcase */
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const AUTH_ERROR = 401;
const baseURL = import.meta.env.VITE_API_URL;

/** Создаем экземпляр Axios для авторизированных запросов на получение данных об опросе */
const surveyAxiosInstance = axios.create({
  baseURL: `${baseURL}/survey`,
});

/** Устанавливаем заголовки для каждого запроса */
const surveyInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  config.headers["Content-Type"] = "application/json";
  config.headers.Accept = "application/json";

  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`;
  }

  return config;
};

surveyAxiosInstance.interceptors.request.use(surveyInterceptor);

/** Интерсептор для обработки ответов и ошибок */
surveyAxiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Извлекаем refreshToken
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (originalRequest && refreshToken && error.response?.status === AUTH_ERROR) {
      try {
        const { data: responseData } = await axios.post(`${baseURL}/auth/refresh`);

        // Сохраняем новый accessToken
        sessionStorage.setItem("accessToken", JSON.stringify(responseData.access_token));

        // Обновляем заголовок авторизации оригинального запроса
        originalRequest.headers.Authorization = `Bearer ${responseData.access_token}`;

        // Повторно отправляем оригинальный запрос с обновленным токеном
        return await surveyAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Здесь можно добавить логику для обработки ошибки обновления токена
      }
    }

    // Пробрасываем оригинальную ошибку, если это не AUTH_ERROR
    return Promise.reject(error);
  }
);

export default surveyAxiosInstance;
