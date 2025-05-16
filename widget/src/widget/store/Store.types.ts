import { DeviceOS } from "../services/DeviceService";

/** Данные хранящиеся в Store, для доступа из всего приложения */
export type TState = {
  /** Текст с владельцем опроса для подстановки уникального идентификатора */
  owner: string;
  /** Текущее устройство */
  device: DeviceOS;
  /** Сессия опроса */
  sessionId?: number;
  /** Таймер опроса */
  surveyTimer: number;
};
