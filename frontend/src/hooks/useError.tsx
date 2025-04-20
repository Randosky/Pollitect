import axios from "axios";

import { useAppDispatch } from "../store/hooks";
import { openToaster } from "../store/slices/layout";

/**
 * Возвращает функцию, которая обрабатывает ошибку и отправляет уведомление-тостер
 * с сообщением об ошибке.
 *
 * Если ошибка является ошибкой Axios, она будет использовать свойство message
 * ответа ошибки, если оно доступно, в противном случае будет использоваться
 * сообщение по умолчанию.
 *
 * Если ошибка не является ошибкой Axios, она будет выведена в консоль,
 * и будет отправлено уведомление-тостер с сообщением по умолчанию.
 *
 * @returns {(error: unknown) => void}
 */
export const useError = (): ((error: unknown) => void) => {
  const dispatch = useAppDispatch();

  return (error: unknown) => {
    if (axios.isAxiosError(error)) {
      // Проверяем, является ли ошибка ошибкой Axios
      const errorMessage =
        typeof error.response?.data?.message === "string" ? error.response.data.message : "Произошла ошибка";

      // Отправляем уведомление-тостер с сообщением об ошибке
      dispatch(openToaster({ content: errorMessage }));
    } else if (error instanceof Error) {
      dispatch(openToaster({ content: error.message }));
    } else {
      console.error("Ошибка:", error);
      dispatch(openToaster({ content: "Произошла ошибка" }));
    }
  };
};
