/** Тип операционной системы устройства. */
export enum DeviceOS {
  Desktop = "pc",
  Mobile = "mobile",
}

/**
 * Проверяет, является ли текущая платформа iOS.
 * @returns {boolean} true, если текущая платформа iOS; в противном случае - false.
 */
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && "MSStream" in window && !window.MSStream;
}

/** Сервис для работы с устройствами. */
class DeviceService {
  private currentOS: DeviceOS;
  private listeners: Array<(os: DeviceOS) => void> = [];

  constructor() {
    this.currentOS = this.getDeviceOS();
    this.initDeviceChangeListener();
  }

  /**
   * Возвращает тип операционной системы устройства.
   * @returns {DeviceOS} Тип операционной системы устройства.
   */
  getDeviceOS = (): DeviceOS => {
    // eslint-disable-next-line
    const userAgent = navigator.userAgent || (window as any).opera;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    return isMobileDevice ? DeviceOS.Mobile : DeviceOS.Desktop;
  };

  /**
   * Инициализирует слушатель для автоматического определения смены девайса.
   * @returns {void}
   */
  private initDeviceChangeListener(): void {
    window.addEventListener("resize", this.checkDeviceChange);
  }

  /**
   * Проверяет смену типа устройства.
   * @returns {void}
   */
  private checkDeviceChange = (): void => {
    const newOS = this.getDeviceOS();

    if (newOS !== this.currentOS) {
      this.currentOS = newOS;
      this.notifyListeners();
    }
  };

  /**
   * Уведомляет всех слушателей о смене типа устройства.
   * @returns {void}
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentOS));
  }

  /**
   * Добавляет слушателя для смены типа устройства.
   * @param {function} listener - Слушатель для добавления.
   * @returns {void}
   */
  addDeviceChangeListener(listener: (os: DeviceOS) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Удаляет слушателя для смены типа устройства.
   * @param {function} listener - Слушатель для удаления.
   * @returns {void}
   */
  removeDeviceChangeListener(listener: (os: DeviceOS) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Устанавливает внешнюю функцию, которая вызывается при смене девайса.
   * @param {function} handler - Функция-обработчик события смены девайса.
   * @returns {void}
   */
  setExternalChangeHandler(handler: (os: DeviceOS) => void): void {
    this.addDeviceChangeListener(handler);
  }
}

export default DeviceService;
