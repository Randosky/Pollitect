import { DeviceOS } from "@services/DeviceService";

import type { TState } from "./Store.types";

/** Глобальное хранилище состояния приложения. */
class Store {
  private state: TState;

  constructor(initialState: TState) {
    this.state = initialState;
  }

  /**
   * Получение всех значений Store.
   *
   * @returns {TState} Возвращает объект состояния Store типа TState.
   */
  getState(): TState {
    return this.state;
  }

  // eslint-disable-next-line
  private keyObservers: Map<string, Function[]> = new Map();

  /**
   * Подписка на отслеживание изменения ключа.
   *
   * @template K - Тип ключа из TState.
   * @param {K} key - Ключ, на который происходит подписка.
   * @param {(prevState: TState[K], nextState: TState[K]) => void} observer - Функция-наблюдатель,
   * вызываемая при изменении значения ключа.
   * @returns {void}
   */
  subscribe<K extends keyof TState>(key: K, observer: (prevState: TState[K], nextState: TState[K]) => void): void {
    if (!this.keyObservers.has(key)) this.keyObservers.set(key, []);

    this.keyObservers.get(key)!.push(observer);
  }

  /**
   * Отписка от отслеживания ключа.
   *
   * @template K - Тип ключа из TState.
   * @param {K} key - Ключ, от которого нужно отписаться.
   * @param {(prevState: TState[K], nextState: TState[K]) => void} observer - Функция-наблюдатель для отписки.
   * @returns {void}
   */
  unsubscribe<K extends keyof TState>(key: K, observer: (prevState: TState[K], nextState: TState[K]) => void): void {
    if (!this.keyObservers.has(key)) return;

    this.keyObservers.set(
      key,
      this.keyObservers.get(key)!.filter(subscriber => subscriber !== observer)
    );
  }

  /**
   * Оповещение о том, что значение по данному ключу изменилось.
   *
   * @param {keyof TState} key - Ключ, по которому произошло изменение значения.
   * @param {TState[keyof TState]} prevState - Предыдущее состояние значения.
   * @param {TState[keyof TState]} newState - Новое состояние значения.
   * @returns {void}
   */
  notifyKeyObservers<K extends keyof TState>(key: K, prevState: TState[K], newState: TState[K]): void {
    if (!this.keyObservers.has(key)) return;

    this.keyObservers.get(key)!.forEach(observer => observer(prevState, newState));
  }

  /**
   * Обновление значения в Store по ключу и новому значению.
   *
   * @template K - Тип ключа из TState.
   * @param {K} key - Ключ, по которому нужно обновить значение в Store.
   * @param {TState[K]} value - Новое значение для обновления.
   * @returns {void}
   */
  updateState<K extends keyof TState>(key: K, value: TState[K]): void {
    const prevState = { ...this.state };

    if (key in this.state) {
      this.state[key] = value;
      this.notifyKeyObservers(key, prevState[key], value);
    }
  }

  /**
   * Получение значения из Store по ключу.
   *
   * @template K - Тип ключа из TState.
   * @param {K} key - Ключ, по которому нужно получить значение из Store.
   * @returns {TState[K]} - Значение из Store, соответствующее указанному ключу.
   */
  getStateByKey<K extends keyof TState>(key: K): TState[K] {
    return this.state[key];
  }
}

/** Изначальные данные для Store */
const initialState: TState = {
  device: DeviceOS.Mobile,
};

const store = new Store(initialState);

export default store as Store;
