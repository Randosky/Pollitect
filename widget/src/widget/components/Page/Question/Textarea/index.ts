import Question from "..";
import { OWNER } from "@widget/vars";

import type { TAnswer } from "@widget/Survey.types";

/**
 * Вопрос «Многострочный текст» (textarea).
 */
export default class TextareaQuestion extends Question {
  /** Многострочное поле ввода */
  private textarea!: HTMLTextAreaElement;
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
    /** Стили для textarea */
    this.shadow.appendChild(this.styleElement());

    /** Корневой контейнер вопроса */
    const container = this.createContainer();

    /** Заголовок + описание */
    const header = this.createHeader();

    container.appendChild(header);

    /** Форма с textarea */
    const form = this.createForm();

    this.textarea = this.createTextarea();
    form.appendChild(this.textarea);
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

    /** Навешиваем обработчики */
    this.initEvents();
  }

  /**
   * Создаёт <textarea>
   */
  private createTextarea(): HTMLTextAreaElement {
    const ta = document.createElement("textarea");

    ta.className = "question-textarea";

    if (this.data?.required) {
      ta.required = true;
    }

    return ta;
  }

  /**
   * Навешивает слушатели на textarea и кнопки
   */
  private initEvents(): void {
    /** Активируем кнопку при вводе текста */
    this.textarea.addEventListener("input", () => {
      this.sendButton.disabled = !this.textarea.value.trim();
    });

    /** Обработка отправки */
    this.sendButton.addEventListener("click", e => {
      e.preventDefault();
      const val = this.textarea.value.trim();

      if (!val) return;

      const answer: TAnswer = {
        question_id: this.data!.id!,
        value: val,
      };

      this.sendAnswer(answer);
    });
  }

  /**
   * Стили для TextareaQuestion
   */
  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    style.textContent = `
      .question-textarea {
        width: 100%;
        max-width: 400px;
        min-height: 100px;
        padding: 8px 12px;
        font-size: var(--${OWNER}-font-size-button);
        border: 1px solid var(--${OWNER}-btn-bg-color);
        border-radius: 5px;
        background: #fff;
        color: var(--${OWNER}-text-color);
        resize: none;
      }
        
      .question-textarea::-webkit-scrollbar {
        width: 8px;
      }

      .question-textarea::-webkit-scrollbar-track {
        border-radius: 5px;
        background: var(--${OWNER}-secondary-bg-color);
      }

      .question-textarea::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: #909090;
      }

      .question-textarea:focus {
        outline: none;
        box-shadow: 0 0 0 1px var(--${OWNER}-btn-bg-color);
      }
    `;

    return style;
  }
}
