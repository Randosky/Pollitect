import { OWNER } from "@widget/vars";

import type { TAnswer, TQuestion } from "@widget/Survey.types";

/**
 * Базовый класс для всех вопросов.
 * Содержит ShadowRoot, onNext и общие хелперы.
 */
export default abstract class Question extends HTMLElement {
  /** Shadow root для рендера */
  protected shadow: ShadowRoot;
  /** Данные вопроса */
  protected externalData?: TQuestion;
  /** Колбек перехода к следующему шагу */
  public onNext?: () => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  /**
   * Устанавливаем данные
   */
  set data(value: TQuestion) {
    this.externalData = value;
  }

  get data(): TQuestion | undefined {
    return this.externalData;
  }

  /** Каждый потомок обязан реализовать рендер */
  protected abstract render(): void;

  /** Создаёт корневой контейнер вопроса */
  protected createContainer(): HTMLDivElement {
    const c = document.createElement("div");

    c.className = "question-container";

    return c;
  }

  /** Создаёт блок с заголовком+описанием */
  protected createHeader(): HTMLDivElement {
    const header = document.createElement("div");

    header.className = "question-header";

    if (!this.data) return header;

    if (this.data.title) {
      const h = document.createElement("h1");

      h.className = "question-title";
      h.innerHTML = this.data.title;
      header.appendChild(h);
    }

    if (this.data.description) {
      const p = document.createElement("p");

      p.className = "question-description";
      p.innerHTML = this.data.description;
      header.appendChild(p);
    }

    return header;
  }

  /** Создаёт форму для ответа и пропуска */
  protected createForm(): HTMLFormElement {
    const form = document.createElement("form");

    form.className = "question-form";

    return form;
  }

  /** Контейнер для кнопок */
  protected createButtonContainer(): HTMLDivElement {
    const buttonContainer = document.createElement("div");

    buttonContainer.className = "question-button-container";

    return buttonContainer;
  }

  /** Кнопка действия */
  protected createSendButton(): HTMLButtonElement {
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "question-send-button";
    btn.innerHTML = "Ответить";

    return btn;
  }

  /** Кнопка действия */
  protected createSkipButton(): HTMLButtonElement {
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "question-skip-button";
    btn.innerHTML = "Пропустить";
    btn.onclick = () => this.onNext?.();

    return btn;
  }

  /** Отправляем запрос на отправку ответа */
  protected sendAnswer(answer: TAnswer): void {
    console.log(answer);

    this.onNext?.();
  }

  /** Общие стили для вопросов */
  protected styleQuestionElement(): HTMLStyleElement {
    const style = document.createElement("style");

    style.textContent = `
      .question-container {
        gap: 16px;
        width: 100%;
        height: 100%;
        display: flex;
        overflow-y: auto;
        flex-direction: column;
        box-sizing: border-box;
        background: transparent;
      }

      .question-container * {
        box-sizing: border-box;
        color: var(--${OWNER}-text-color);
        font-family: var(--${OWNER}-font-family);
      }

      .question-header {
        gap: 12px;
        display: flex;
        flex-direction: column;
      }

      .question-title {
        margin: 0;
        overflow-wrap: break-word;
        color: var(--${OWNER}-text-color);
        font-size: var(--${OWNER}-font-size-header);
      }

      .question-description {
        margin: 0;
        overflow-wrap: break-word;
        color: var(--${OWNER}-text-color);
        font-size: var(--${OWNER}-font-size-description);
      }

      .question-form {
        gap: 16px;
        padding: 16px;
        margin: auto 0;
        display: flex;
        align-items: center;
        flex-direction: column;
      }

      .question-button-container {
        gap: 16px;
        width: 100%;
        height: fit-content;
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .question-send-button,
      .question-skip-button {
        color: #fff;
        cursor: pointer;
        padding: 10px 24px;
        border-radius: 5px;
        width: fit-content;
        height: fit-content;
        color: var(--${OWNER}-btn-color);
        font-size: var(--${OWNER}-font-size-button);
      }

      .question-send-button:hover:not(:disabled),
      .question-skip-button:hover:not(:disabled) {
        scale: 0.98
      }

      .question-send-button:active:not(:disabled),
      .question-skip-button:active:not(:disabled) {
        scale: 0.95
      }

      .question-send-button {
        border: none;
        background-color: var(--${OWNER}-btn-bg-color);
      }

      .question-send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .question-skip-button {
        background: transparent;
        color: var(--${OWNER}-btn-bg-color);
        border: 1px solid var(--${OWNER}-btn-bg-color);
      }
    `;

    return style;
  }
}
