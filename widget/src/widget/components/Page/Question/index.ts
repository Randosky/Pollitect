import Store from "@widget/store/Store";
import { SERVER_URL } from "@widget/vars";

import type { ISurvey, TAnswer, TQuestion } from "@widget/Survey.types";

export type TQuestionExternalData = {
  question: TQuestion;
  surveyData: ISurvey;
  onNext: () => void;
};

/**
 * Базовый класс для всех вопросов.
 * Содержит ShadowRoot, onNext и общие хелперы.
 */
export default abstract class Question extends HTMLElement {
  /** Shadow root для рендера */
  protected shadow: ShadowRoot;
  /** Данные вопроса */
  protected externalData?: TQuestionExternalData;
  /** Хранилище данных в виджете */
  protected store?: typeof Store;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.store = Store;
  }

  /**
   * Устанавливаем данные
   */
  set data(value: TQuestionExternalData) {
    this.externalData = value;
  }

  get data(): TQuestionExternalData | undefined {
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
    const { question } = this.data || {};

    const header = document.createElement("div");

    header.className = "question-header";

    if (!question) return header;

    if (question.title) {
      const h = document.createElement("h1");

      h.className = "question-title";
      h.innerHTML = question.title;
      header.appendChild(h);
    }

    if (question.description) {
      const p = document.createElement("p");

      p.className = "question-description";
      p.innerHTML = question.description;
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
    const { onNext } = this.data || {};

    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "question-skip-button";
    btn.innerHTML = "Пропустить";
    btn.onclick = () => onNext?.();

    return btn;
  }

  /** Отправляем запрос на отправку ответа */
  protected async sendAnswer(answer: TAnswer): Promise<void> {
    const { onNext } = this.data || {};

    const sessionId = this.store?.getStateByKey("sessionId");

    if (!sessionId) return;

    try {
      await fetch(`${SERVER_URL}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, surveyId: this.data?.surveyData.id, answer }),
      });

      onNext?.();
    } catch {
      onNext?.();
    }
  }

  /** Общие стили для вопросов */
  protected styleQuestionElement(): HTMLStyleElement {
    const style = document.createElement("style");

    const owner = this.store?.getStateByKey("owner");

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
        color: var(--${owner}-text-color);
        font-family: var(--${owner}-font-family);
      }

      .question-header {
        gap: 12px;
        display: flex;
        flex-direction: column;
      }

      .question-title {
        margin: 0;
        overflow-wrap: break-word;
        color: var(--${owner}-text-color);
        font-size: var(--${owner}-font-size-header);
      }

      .question-description {
        margin: 0;
        overflow-wrap: break-word;
        color: var(--${owner}-text-color);
        font-size: var(--${owner}-font-size-description);
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
        color: var(--${owner}-btn-color);
        font-size: var(--${owner}-font-size-button);
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
        background-color: var(--${owner}-btn-bg-color);
      }

      .question-send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .question-skip-button {
        background: transparent;
        color: var(--${owner}-btn-bg-color);
        border: 1px solid var(--${owner}-btn-bg-color);
      }
    `;

    return style;
  }
}
