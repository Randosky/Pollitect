/**
 * Хук, проверяющий авторизован ли пользователь
 *
 * @returns {boolean} - статус авторизации
 */
const useAuth = (): boolean => {
  const accessToken = sessionStorage.getItem("accessToken");

  return !!accessToken;
};

export default useAuth;
