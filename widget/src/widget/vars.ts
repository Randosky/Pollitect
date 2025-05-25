/** Универсальная переменная для определения пренодлежности элементов и стилей к опросу */
export const OWNER = "pollitect-survey";

/** Адрес сервера */
// export const FRONTEND_URL = "http://localhost:7124";
// export const SERVER_URL = "http://localhost:3000";
// export const SERVER_URL_WIDGET = "http://localhost:3000/api/widget";
export const FRONTEND_URL = "https://pollitect.onrender.com";
export const SERVER_URL = "https://pollitect-backend.onrender.com";
export const SERVER_URL_WIDGET = "https://pollitect-backend.onrender.com/api/widget";

/** Ширина на мобилке */
export const MOBILE_WIDTH = 768;

/** Милисекунды в секунде */
export const MS_IN_SECOND = 1000;

/** Секунды в минуте */
export const SECONDS_IN_MIN = 60;

/** Ключ текущего шага в хранилище */
export const CURRENT_STEP_KEY = `${OWNER}-current-step`;

/** Оставшееся время таймера */
export const TIMER_KEY = `${OWNER}-timer`;
