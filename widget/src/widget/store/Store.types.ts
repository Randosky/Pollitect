import { DeviceOS } from "../services/DeviceService";

/** Данные хранящиеся в Store, для доступа из всего приложения */
export type TState = {
  /** Текущее устройство */
  device: DeviceOS;
  /** Сессия опроса */
  sessionId?: number;
  /** Таймер опроса */
  surveyTimer: number;
};
