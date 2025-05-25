import { createWebComponent, registerWebComponent } from "@services/ComponentService";
import Store from "@widget/store/Store";
import { CURRENT_STEP_KEY, MS_IN_SECOND, SECONDS_IN_MIN, TIMER_KEY } from "@widget/vars";

import type { ISurvey, TQuestion } from "../../Survey.types";
import type {
  TQuestionComponent,
  TScreenComponent,
  TScreenComponentsData,
  TScreenComponentsType,
} from "./SurveyElement.types";

import BinaryQuestion from "./Question/Binary";
import DateQuestion from "./Question/Date";
import DropdownQuestion from "./Question/Dropdown";
import MultiQuestion from "./Question/Multi";
import SingleQuestion from "./Question/Single";
import TextQuestion from "./Question/Text";
import TextareaQuestion from "./Question/Textarea";
import CompletionScreen from "./Screen/Completion";
import PersonalScreen from "./Screen/Personal";
import WelcomeScreen from "./Screen/Welcome";

const TIMER_MARGIN = 8;
const TIMER_WIDTH = 52;
const TIMER_HEIGHT = 28;

export class SurveyElement extends HTMLElement {
  /** Дерево компонентов */
  private shadow: ShadowRoot;
  /** Хранилище данных в виджете */
  private store?: typeof Store;
  /** Данные опроса */
  private externalData?: ISurvey;
  /** Текущий шаг */
  private currentStep: number;
  /** Массив шагов */
  private steps: (TScreenComponent | TQuestionComponent)[] = [];

  /** Элемент контейнера */
  public container?: HTMLDivElement;
  /** Элемент таймера */
  private timerEl?: HTMLDivElement;
  /** Интервал таймера */
  private timerInterval?: number;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.store = Store;

    this.currentStep = Number(sessionStorage.getItem(CURRENT_STEP_KEY) || 0) - 1;

    registerWebComponent("binary-question", BinaryQuestion);
    registerWebComponent("date-question", DateQuestion);
    registerWebComponent("dropdown-question", DropdownQuestion);
    registerWebComponent("multi-question", MultiQuestion);
    registerWebComponent("single-question", SingleQuestion);
    registerWebComponent("text-question", TextQuestion);
    registerWebComponent("textarea-question", TextareaQuestion);
    registerWebComponent("welcome-screen", WelcomeScreen);
    registerWebComponent("personal-screen", PersonalScreen);
    registerWebComponent("completion-screen", CompletionScreen);
  }

  /**
   * Обновляет данные опроса и переинициализирует компонент.
   *
   * @param {ISurvey} survey - Новые данные опроса для установки.
   */
  set data(survey: ISurvey) {
    this.externalData = survey;
  }

  /**
   * Возвращает текущие данные опроса, если они есть.
   *
   * @returns {ISurvey | undefined} Данные опроса или undefined, если данные не установлены.
   */
  get data(): ISurvey | undefined {
    return this.externalData;
  }

  /** Колбек при подключении класса срабатывает после установки данных */
  connectedCallback(): void {
    this.init();
  }

  /** Инициализирует компонент */
  private init(): void {
    if (!this.externalData) return;

    const { questions, welcomeScreen, personalScreen, completionScreen } = this.externalData;

    /** Добавляем экран приветствия */
    if (welcomeScreen.active) {
      const screen = this.createScreenComponent("welcome-screen", welcomeScreen);

      if (screen) this.steps.push(screen);
    }

    /** Добавляем вопросы */
    this.steps.push(...questions.sort((a, b) => a.order - b.order).map(q => this.createQuestionComponent(q)));

    /** Добавляем экран персональных данных */
    if (personalScreen.active) {
      const screen = this.createScreenComponent("personal-screen", personalScreen);

      if (screen) this.steps.push(screen);
    }

    /** Добавляем экран завершения */
    if (completionScreen.active) {
      const screen = this.createScreenComponent("completion-screen", completionScreen);

      if (screen) this.steps.push(screen);
    }

    this.render();
  }

  /** Рендерим компонент */
  private render(): void {
    this.shadow.innerHTML = "";
    this.shadow.appendChild(this.styleElement());

    this.createContainer();
    this.createTimer();

    this.next();
  }

  /**
   * Функция для создания контейнера опроса
   * @returns {void}
   */
  private createContainer = (): void => {
    this.container = document.createElement("div");
    this.container.classList.add("container");

    this.shadow.appendChild(this.container);
  };

  /** Добавляем элемент таймера в правый верхний угол */
  private createTimer() {
    if (!this.container) return;

    this.timerEl = document.createElement("div");
    this.timerEl.classList.add("timer");

    // Сразу установить начальную позицию
    this.updateTimerPosition();

    this.shadow.appendChild(this.timerEl);

    window.addEventListener("scroll", this.updateTimerPosition.bind(this));
    window.addEventListener("resize", this.updateTimerPosition.bind(this));
  }

  /** Обновление позиции таймера */
  private updateTimerPosition = () => {
    const paddings = this.data?.design_settings?.padding;

    if (!paddings || !this.container || !this.timerEl) return;

    const rect = this.container.getBoundingClientRect();

    const left = rect.left + paddings[3];
    const top = rect.height + rect.top - TIMER_HEIGHT - paddings[0];

    this.timerEl.style.left = `${left}px`;
    this.timerEl.style.top = `${top}px`;
  };

  /**
   * Создает экземпляр экрана
   * @param {TScreenComponentsType} type - тип экрана
   * @param {TScreenComponentsData} data - данные для экрана
   * @returns {TScreenComponent | undefined} веб компонент экрана
   */
  private createScreenComponent = (
    type: TScreenComponentsType,
    data: TScreenComponentsData
  ): TScreenComponent | undefined => {
    if (!data.active) return;

    const component = createWebComponent(type);

    component.data = {
      screen: data,
      surveyData: this.data!,
      onNext: () => this.next(),
    };

    return component;
  };

  /**
   * Создает экземпляр вопроса
   * @param {TQuestion} question - данные вопроса
   * @returns {TQuestionComponent} массив веб-компонентов вопросов
   */
  private createQuestionComponent = (question: TQuestion): TQuestionComponent => {
    const component = createWebComponent(`${question.type}-question`);

    component.data = {
      question,
      surveyData: this.data!,
      onNext: () => this.next(),
    };

    return component;
  };

  /** Переходим к следующему шагу */
  public next(): void {
    if (!this.container) return;

    this.currentStep++;
    sessionStorage.setItem(CURRENT_STEP_KEY, this.currentStep.toString());

    /** Если перешли на первый вопрос и есть таймер */
    if (this.currentStep >= 1 && (this.data?.display_settings.timer_sec || 0) > 0) {
      this.startTimer();
    }

    /** Останавливаем таймер на последней странице */
    if (this.currentStep === this.steps.length - 1) {
      this.stopTimer();
      this.timerEl?.parentNode?.removeChild(this.timerEl);
    }

    const currentComponent = this.steps[this.currentStep];

    if (!currentComponent) {
      this.container.innerHTML = "<p>Опрос завершён</p>";

      return;
    }

    this.container.innerHTML = "";
    this.container.appendChild(currentComponent);
  }

  /** Запускаем обратный отсчёт */
  public startTimer(): void {
    /** Не запускаем, если нет таймера */
    if (!this.timerEl || !this.data || this.data.display_settings.timer_sec <= 0) return;

    /** остановить прежний, если был */
    this.stopTimer();

    /** Начало таймера */
    let remaining = Number(sessionStorage.getItem(TIMER_KEY)) || this.data.display_settings.timer_sec;

    this.updateTimerDisplay(remaining);
    this.timerEl.classList.add("show");

    /** Обновление таймера */
    this.timerInterval = setInterval(() => {
      remaining -= 1;
      this.updateTimerDisplay(remaining);
    }, MS_IN_SECOND);
  }

  /** Останавливаем таймер */
  public stopTimer(): void {
    if (this.timerInterval === null) return;

    clearInterval(this.timerInterval);
    this.timerInterval = undefined;
  }

  /** Обновляем текст таймера в формате MM:SS */
  private updateTimerDisplay(sec: number) {
    if (!this.timerEl) return;

    /** Если таймер закончился переходим в конец */
    if (sec <= 0 && this.container) {
      this.stopTimer();

      this.timerEl.classList.add("hidden");
      this.container.innerHTML = "";
      this.container.appendChild(this.steps[this.steps.length - 1]);
    }

    /** Отображаем новые минуты и секунды */
    const rawMin = Math.floor(sec / SECONDS_IN_MIN);
    const minutes = Math.min(rawMin, SECONDS_IN_MIN - 1);
    const seconds = sec % SECONDS_IN_MIN;

    const two = (n: number) => String(n).padStart(2, "0");

    this.timerEl.textContent = `${two(minutes)}:${two(seconds)}`;

    /** Обновляем время в сторе */
    this.store?.updateState("surveyTimer", sec);
    /** Обновляем время в хранилище */
    sessionStorage.setItem(TIMER_KEY, sec.toString());
  }

  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    const owner = this.store?.getStateByKey("owner");

    const { width, width_unit, height, height_unit, borderRadius, margin, padding } =
      this.externalData!.design_settings;

    style.textContent = `
        .container {
          position: relative;
          box-sizing: border-box;
          width: ${width}${width_unit};
          height: ${height}${height_unit};
          background: var(--${owner}-bg-color);
          margin: ${margin.map(px => px + "px").join(" ")};
          padding: ${padding.map(px => px + "px").join(" ")};
          border-radius: ${borderRadius.map(px => px + "px").join(" ")};
        }

        .container * {
          box-sizing: border-box;
          border-radius: inherit;
          color: var(--${owner}-text-color);
          font-family: var(--${owner}-font-family);
        }

        .timer {
          font-size: 14px;
          line-height: 140%;
          font-weight: bold;
          font-family: var(--${owner}-font-family);
          
          z-index: 4;
          display: none;
          position: fixed;
          padding: 4px 8px;
          border-radius: 5px;
          width: ${TIMER_WIDTH}px;
          height: ${TIMER_HEIGHT}px;
          box-sizing: border-box;
          color: var(--${owner}-bg-color);
          background: var(--${owner}-btn-bg-color);
        }

        .timer.show {
          display: block;
        }

        .timer.hidden {
          display: none;
        }
      `;

    return style;
  }
}
