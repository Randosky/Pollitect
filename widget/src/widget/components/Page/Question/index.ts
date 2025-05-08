import { TQuestion } from "@widget/Survey.types";

/**
 * Базовый класс для всех вопросов.
 * Содержит только ShadowRoot, onNext и общие хелперы.
 */
export default abstract class Question extends HTMLElement {
  /** Корневой элемент */
  protected shadow: ShadowRoot;
  /** Внешние данные */
  protected externalData?: TQuestion;
  /** Функция, вызывающая следующий шаг */
  public onNext?: () => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  /**
   * Устанавливаем данные и сразу рисуем.
   */
  set data(value: TQuestion) {
    this.externalData = value;
  }

  get data(): TQuestion | undefined {
    return this.externalData;
  }

  /**
   * Каждый потомок обязан реализовать отрисовку:
   * - прочитать свои данные,
   * - вставить всё в this.shadow,
   * - задать обработчики,
   * - вызвать this.onNext().
   */
  protected abstract render(): void;

  /** Хелпер для контейнера вопроса */
  protected createContainer(): HTMLDivElement {
    const c = document.createElement("div");

    c.className = "question-container";

    return c;
  }

  /** Хелпер для кнопки */
  protected createButton(label: string): HTMLButtonElement {
    const btn = document.createElement("button");

    btn.type = "button";
    btn.textContent = label;
    btn.className = "survey-button";

    return btn;
  }
}
