import Question from "..";
import { OWNER } from "@widget/vars";

import type { TAnswer } from "@widget/Survey.types";

/**
 * Вопрос «Текстовый ввод».
 */
export default class TextQuestion extends Question {
  /** Текстовое поле */
  private textInput!: HTMLInputElement;
  /** Кнопка «Ответить» */
  private sendButton!: HTMLButtonElement;
  /** Кнопка «Пропустить» */
  private skipButton?: HTMLButtonElement;

  constructor() {
    super();
  }

  connectedCallback() {
    if (this.data) {
      this.render();
    }
  }

  protected render(): void {
    if (!this.data) return;

    /** Сброс предыдущего рендера */
    this.shadow.innerHTML = "";

    /** Общие стили вопросов */
    this.shadow.appendChild(this.styleQuestionElement());
    /** Стили для текстового поля */
    this.shadow.appendChild(this.styleElement());

    /** Корневой контейнер вопроса */
    const container = this.createContainer();

    /** Заголовок + описание */
    const header = this.createHeader();

    container.appendChild(header);

    /** Форма с текстовым полем */
    const form = this.createForm();

    this.textInput = this.createTextInput();
    form.appendChild(this.textInput);
    container.appendChild(form);

    /** Контейнер кнопок */
    const buttonContainer = this.createButtonContainer();

    if (!this.data.question.required) {
      this.skipButton = this.createSkipButton();
      buttonContainer.appendChild(this.skipButton);
    }
    this.sendButton = this.createSendButton();
    this.sendButton.disabled = true;
    buttonContainer.appendChild(this.sendButton);

    container.appendChild(buttonContainer);
    this.shadow.appendChild(container);

    /** Навешиваем обработчики */
    this.initEvents();
  }

  /**
   * Создаёт обычный <input type="text">
   */
  private createTextInput(): HTMLInputElement {
    const input = document.createElement("input");

    input.type = "text";
    input.className = "question-text-input";
    input.placeholder = this.data?.question.title ?? "";

    if (this.data?.question.required) input.required = true;

    return input;
  }

  /**
   * Навешивает слушатели на текстовое поле и кнопки
   */
  private initEvents(): void {
    /** Активируем кнопку при вводе текста */
    this.textInput.addEventListener("input", () => {
      this.sendButton.disabled = !this.textInput.value.trim();
    });

    /** Обработка отправки */
    this.sendButton.addEventListener("click", e => {
      e.preventDefault();
      const val = this.textInput.value.trim();

      if (!val) return;

      const answer: TAnswer = {
        question_id: this.data!.question.id!,
        value: val,
      };

      this.sendAnswer(answer);
    });
  }

  /**
   * Стили для TextQuestion (дополняют базовые)
   */
  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    style.textContent = `
      .question-text-input {
        width: 100%;
        max-width: 400px;
        padding: 8px 12px;
        font-size: var(--${OWNER}-font-size-button);
        border: 1px solid var(--${OWNER}-btn-bg-color);
        border-radius: 5px;
        background: #fff;
        color: #222;
      }
      .question-text-input:focus {
        outline: none;
        box-shadow: 0 0 0 1px var(--${OWNER}-btn-bg-color);
      }
    `;

    return style;
  }
}
