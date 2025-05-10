import Question from "..";
import { OWNER } from "@widget/vars";

import type { TAnswer } from "@widget/Survey.types";

/**
 * Вопрос «Одиночный выбор».
 */
export default class SingleQuestion extends Question {
  /** Контейнер с опциями */
  private optionsContainer!: HTMLDivElement;
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

    /** Очистка предыдущего рендера */
    this.shadow.innerHTML = "";

    /** Общие стили из базового класса */
    this.shadow.appendChild(this.styleQuestionElement());
    /** Стили для single-выбора */
    this.shadow.appendChild(this.styleElement());

    /** Корневой контейнер вопроса */
    const container = this.createContainer();

    /** Заголовок + описание */
    const header = this.createHeader();

    container.appendChild(header);

    /** Форма с радио-опциями */
    const form = this.createForm();

    this.optionsContainer = this.createOptions();
    form.appendChild(this.optionsContainer);
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

    /** Навешиваем события */
    this.initEvents();
  }

  /**
   * Создаёт контейнер grid с кастомными радио-кнопками
   */
  private createOptions(): HTMLDivElement {
    const opts = document.createElement("div");

    opts.className = "question-options";

    this.data!.question.options!.forEach((opt, idx) => {
      const id = `single-${this.data!.question.id}-${idx}`;
      const wrapper = document.createElement("label");

      wrapper.className = "question-option";
      wrapper.htmlFor = id;

      const input = document.createElement("input");

      input.type = "radio";
      input.name = `single-${this.data!.question.id}`;
      input.id = id;
      input.value = opt;

      const fake = document.createElement("span");

      fake.className = "fake";

      const text = document.createElement("span");

      text.className = "text";
      text.textContent = opt;

      wrapper.append(input, fake, text);
      opts.append(wrapper);
    });

    return opts;
  }

  /**
   * Навешивает слушатели на опции и кнопки
   */
  private initEvents(): void {
    /** Активируем кнопку, когда выбран любой radio */
    this.optionsContainer.addEventListener("change", () => {
      const any = !!this.optionsContainer.querySelector('input[type="radio"]:checked');

      this.sendButton.disabled = !any;
    });

    /** Обработка ответа */
    this.sendButton.addEventListener("click", e => {
      e.preventDefault();
      const checked = this.optionsContainer.querySelector('input[type="radio"]:checked') as HTMLInputElement | null;

      if (!checked) return;

      const answer: TAnswer = {
        question_id: this.data!.question.id!,
        value: checked.value,
      };

      this.sendAnswer(answer);
    });
  }

  /**
   * Стили для SingleQuestion (grid + кастомные радио)
   */
  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    style.textContent = `
      .question-options {
        width: 100%;
        display: grid;
        row-gap: 24px;
        column-gap: 32px;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        grid-template-rows: repeat(4, auto);
      }

      .question-option {
        width: fit-content;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        position: relative;
      }

      .question-option input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }
      .question-option .fake {
        width: 20px;
        height: 20px;
        border: 2px solid var(--${OWNER}-btn-bg-color);
        border-radius: 50%;
        position: relative;
        transition: border-color 0.2s;
      }
      .question-option .fake:after {
        content: "";
        position: absolute;
        inset: 4px;
        border-radius: 50%;
        background: var(--${OWNER}-btn-bg-color);
        transform: scale(0);
        transition: transform 0.2s;
      }
      .question-option input:checked + .fake:after {
        transform: scale(1);
      }
      .question-option .text {
        font-size: var(--${OWNER}-font-size-button);
        line-height: 140%;
      }
    `;

    return style;
  }
}
