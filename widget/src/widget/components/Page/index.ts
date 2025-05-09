import { createWebComponent, registerWebComponent } from "@services/ComponentService";
import { OWNER } from "@widget/vars";

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

export class SurveyElement extends HTMLElement {
  /** Дерево компонентов */
  private shadow: ShadowRoot;
  /** Данные опроса */
  private externalData?: ISurvey;
  /** Текущий шаг */
  private currentStep: number = -1;
  /** Массив шагов */
  private steps: (TScreenComponent | TQuestionComponent)[] = [];

  /** Элемент контейнера */
  public container?: HTMLDivElement;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

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

    component.data = data;
    component.onNext = () => this.next();

    return component;
  };

  /**
   * Создает экземпляр вопроса
   * @param {TQuestion} question - данные вопроса
   * @returns {TQuestionComponent} массив веб-компонентов вопросов
   */
  private createQuestionComponent = (question: TQuestion): TQuestionComponent => {
    const component = createWebComponent(`${question.type}-question`);

    component.data = question;
    component.onNext = () => this.next();

    return component;
  };

  /** Переходим к следующему шагу */
  public next(): void {
    if (!this.container) return;

    this.currentStep++;

    const currentComponent = this.steps[this.currentStep];

    if (!currentComponent) {
      this.container.innerHTML = "<p>Опрос завершён</p>";

      return;
    }

    this.container.innerHTML = "";
    this.container.appendChild(currentComponent);
  }

  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    const { width, width_unit, height, height_unit, borderRadius, margin, padding } =
      this.externalData!.design_settings;

    style.textContent = `
        .container {
          position: relative;
          box-sizing: border-box;
          width: ${width}${width_unit};
          height: ${height}${height_unit};
          background: var(--${OWNER}-bg-color);
          margin: ${margin.map(px => px + "px").join(" ")};
          padding: ${padding.map(px => px + "px").join(" ")};
          border-radius: ${borderRadius.map(px => px + "px").join(" ")};
        }

        .container * {
          box-sizing: border-box;
          border-radius: inherit;
          color: var(--${OWNER}-text-color);
          font-family: var(--${OWNER}-font-family);
        }
      `;

    return style;
  }
}
