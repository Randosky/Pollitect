import { SurveyElement } from "@components/Page";
import { createWebComponent, registerWebComponent } from "@services/ComponentService";
import DeviceService, { DeviceOS } from "@services/DeviceService";
import { injectWidgetStyles } from "@services/StylesService";

import type { ISurvey } from "./Survey.types";

import Store from "./store/Store";
import { OWNER } from "./vars";

class Survey {
  /** Данные опроса */
  private data: ISurvey;
  /** Хранилище данных в виджете */
  private store: typeof Store;
  /** Сервис для работы с устройствами */
  private deviceService: DeviceService;

  /** Элемент опроса */
  public surveyElement?: SurveyElement;

  constructor(data: ISurvey, sessionId: number) {
    this.data = data;
    this.store = Store;
    this.deviceService = new DeviceService();

    this.store.updateState("sessionId", sessionId);
    /** инициализируем таймер в сторе */
    this.store.updateState("surveyTimer", data.display_settings.timer_sec);
    /** Инициализируем опрос-владелец для подстановки уникального идентификатора */
    this.store.updateState("owner", `${OWNER}-${data.id}`);

    registerWebComponent("survey-widget", SurveyElement);

    this.init();
  }

  /**
   * Функция инициализации опроса
   * @returns {void}
   */
  private init(): void {
    if (!this.data || !this.deviceService) return;

    const { design_settings } = this.data;

    /** Инициализация стилей */
    injectWidgetStyles(this.store?.getStateByKey("owner"), design_settings);

    /** Регистрируем функцию как внешнюю функцию для обработки смены устройства */
    this.deviceService.setExternalChangeHandler(this.handleDeviceChange);
    this.handleDeviceChange(this.deviceService.getDeviceOS());

    /** Создаем опрос */
    this.surveyElement = createWebComponent("survey-widget");
    this.surveyElement!.data = this.data;
  }

  /**
   * Обрабатывает событие изменения типа устройства, обновляя состояние компонента.
   * Изменяет расположение элемента на странице в соответствии с новым типом устройства.
   * @param {DeviceOS} newOS Новая операционная система устройства.
   * @returns {void}
   */
  handleDeviceChange = (newOS: DeviceOS): void => {
    // Обновляем состояние хранилища, задавая новый тип устройства
    this.store?.updateState("device", newOS);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).Survey = Survey;
export default Survey;
