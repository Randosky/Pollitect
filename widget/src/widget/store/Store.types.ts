import { DeviceOS } from "../services/DeviceService";

/** Данные хранящиеся в Store, для доступа из всего приложения */
export type TState = {
  device: DeviceOS;
};
