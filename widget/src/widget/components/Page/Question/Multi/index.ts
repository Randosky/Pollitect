import Question from "..";
import { OWNER } from "@widget/vars";

import type { TAnswer } from "@widget/Survey.types";

/**
 * Вопрос «Несколько вариантов» (Multi select).
 */
export default class MultiQuestion extends Question {
  /** Контейнер с чекбоксами */
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

    /** Сброс предыдущего рендера */
    this.shadow.innerHTML = "";

    /** Общие стили вопросов */
    this.shadow.appendChild(this.styleQuestionElement());
    /** Стили для чекбоксов */
    this.shadow.appendChild(this.styleElement());

    /** Корневой контейнер вопроса */
    const container = this.createContainer();

    /** Заголовок + описание */
    const header = this.createHeader();

    container.appendChild(header);

    /** Форма с чекбоксами */
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
   * Создаёт кастомные чекбоксы
   */
  private createOptions(): HTMLDivElement {
    const opts = document.createElement("div");

    opts.classList.add("question-options");

    this.data!.question.options?.forEach((opt, idx) => {
      const id = `multi-${this.data!.question.id}-${idx}`;
      const wrapper = document.createElement("label");

      wrapper.className = "checkbox";
      wrapper.htmlFor = id;

      const input = document.createElement("input");

      input.type = "checkbox";
      input.id = id;
      input.name = `multi-${this.data!.question.id}`;
      input.value = opt;

      if (this.data!.question.required) {
        input.required = false;
        // required не работает для множественного выбора, проверяем вручную
      }

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
   * Навешивает слушатели на контейнер чекбоксов и кнопки
   */
  private initEvents(): void {
    /** активируем кнопку, если выбран хотя бы один */
    this.optionsContainer.addEventListener("change", () => {
      const anyChecked = !!this.optionsContainer.querySelector('input[type="checkbox"]:checked');

      this.sendButton.disabled = !anyChecked;
    });

    /** обработка клика «Ответить» */
    this.sendButton.addEventListener("click", e => {
      e.preventDefault();
      const checked = Array.from(
        this.optionsContainer.querySelectorAll('input[type="checkbox"]:checked')
      ) as HTMLInputElement[];

      if (checked.length === 0) return;

      const values = checked.map(i => i.value);
      const answer: TAnswer = {
        question_id: this.data!.question.id!,
        value: values,
      };

      this.sendAnswer(answer);
    });
  }

  /**
   * Стили для MultiQuestion (кастомные чекбоксы)
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

      .checkbox {
        width: fit-content;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        position: relative;
      }
        
      .checkbox input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      .checkbox .fake {
        width: 18px;
        height: 18px;
        border: 2px solid var(--${OWNER}-btn-bg-color);
        border-radius: 4px;
        transition: background 0.2s, border-color 0.2s;
        position: relative;
        flex-shrink: 0;
      }

      .checkbox .fake::after {
        content: "";
        position: absolute;
        bottom: 20%;
        right: 25%;
        width: 6px;
        height: 10px;
        border-right: 2px solid transparent;
        border-bottom: 2px solid transparent;
        transform: rotate(45deg) scale(0);
        transition: transform 0.15s ease-out, border-color 0.2s;
      }

      .checkbox input:checked + .fake {
        background: var(--${OWNER}-btn-bg-color);
        border-color: var(--${OWNER}-btn-bg-color);
      }

      .checkbox input:checked + .fake::after {
        border-color: var(--white, #fff);
        transform: rotate(45deg) scale(1);
      }

      .checkbox input:disabled + .fake {
        opacity: 0.6;
      }

      .checkbox .text {
        font-size: var(--${OWNER}-font-size-description);
        line-height: 1.25;
        color: var(--${OWNER}-text-color);
      }

      @media (min-width: 600px) {
        .checkbox .text {
          font-size: var(--${OWNER}-font-size-button);
        }
      }
    `;

    return style;
  }
}
