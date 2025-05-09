import Question from "..";
import { OWNER } from "@widget/vars";

import type { TAnswer } from "@widget/Survey.types";

/**
 * Вопрос «Дата».
 */
export default class DateQuestion extends Question {
  /** Поле ввода даты */
  private dateInput!: HTMLInputElement;
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

    /** Подключаем базовые стили вопросов */
    this.shadow.appendChild(this.styleQuestionElement());
    /** Подключаем стили для date-input и кнопок */
    this.shadow.appendChild(this.styleElement());

    /** Корневой контейнер вопроса */
    const container = this.createContainer();
    /** Заголовок + описание */
    const header = this.createHeader();

    container.appendChild(header);

    /** Форма с полем даты */
    const form = this.createForm();

    this.dateInput = this.createDateInput();
    form.appendChild(this.dateInput);
    container.appendChild(form);

    /** Контейнер кнопок */
    const buttonContainer = this.createButtonContainer();

    if (!this.data.required) {
      this.skipButton = this.createSkipButton();
      buttonContainer.appendChild(this.skipButton);
    }

    this.sendButton = this.createSendButton();
    this.sendButton.disabled = true;
    buttonContainer.appendChild(this.sendButton);

    container.appendChild(buttonContainer);
    this.shadow.appendChild(container);

    /** Инициализируем слушатели событий */
    this.initEvents();
  }

  /**
   * Навешивает слушатели на input и кнопки
   */
  private initEvents(): void {
    /** Активируем кнопку «Ответить» при выборе даты */
    this.dateInput.addEventListener("change", () => {
      this.sendButton.disabled = !this.dateInput.value;
    });

    /** Открываем календарь при клике */
    this.dateInput.addEventListener("click", () => {
      if (typeof this.dateInput.showPicker === "function") {
        this.dateInput.showPicker();
      }
    });

    /** Обработка отправки */
    this.sendButton.addEventListener("click", e => {
      e.preventDefault();

      if (!this.dateInput.value) return;

      const answer: TAnswer = {
        question_id: this.data!.id!,
        value: this.dateInput.value,
      };

      this.sendAnswer(answer);
    });
  }

  /**
   * Создаёт поле <input type="date">
   */
  private createDateInput(): HTMLInputElement {
    const input = document.createElement("input");

    input.type = "date";
    input.className = "question-date-input";

    if (this.data?.required) {
      input.required = true;
    }

    return input;
  }

  /**
   * Стили для DateQuestion (дополняют базовые)
   */
  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    style.textContent = `
      .question-date-input {
        width: 100%;
        max-width: 400px;
        padding: 8px 12px;
        font-size: var(--${OWNER}-font-size-button);
        border: 1px solid var(--${OWNER}-btn-bg-color);
        border-radius: 5px;
        background: #fff;
        color: var(--${OWNER}-text-color);
        cursor: pointer;
      }

      .question-date-input:focus {
        cursor: text;
        outline: none;
        box-shadow: 0 0 0 1px var(--${OWNER}-btn-bg-color);
      }
    `;

    return style;
  }
}
