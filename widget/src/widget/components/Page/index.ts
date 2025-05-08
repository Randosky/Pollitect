import { createWebComponent, registerWebComponent } from "@services/ComponentService";

import type { ISurvey } from "../../Survey.types";
import type { TScreenComponent, TScreenComponentsData, TScreenComponentsType } from "./SurveyElement.types";

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
  private steps: TScreenComponent[] = [];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    // registerWebComponent("questions", Questions);
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

    const { welcomeScreen, personalScreen, completionScreen } = this.externalData;

    /** Добавляем экран приветствия */
    if (welcomeScreen.active) {
      const screen = this.createScreenComponent("welcome-screen", welcomeScreen);

      if (screen) this.steps.push(screen);
    }

    /** Добавляем вопросы */
    // this.steps.push(...questions.map(q => createQuestionComponent(q)));

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

    this.next();
  }

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

    return component;
  };

  /** Переходим к следующему шагу */
  public next(): void {
    this.currentStep++;

    const currentComponent = this.steps[this.currentStep];

    if (!currentComponent) {
      this.shadow.innerHTML = "<p>Опрос завершён</p>";

      return;
    }

    this.shadow.innerHTML = "";
    currentComponent.onNext = () => this.next();
    this.shadow.appendChild(currentComponent);
  }
}
