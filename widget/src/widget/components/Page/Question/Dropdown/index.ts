import Question from "..";
import { OWNER } from "@widget/vars";

import type { TAnswer } from "@widget/Survey.types";

/**
 * Вопрос «Dropdown» (выпадающий список).
 */
export default class DropdownQuestion extends Question {
  /** Выпадающий селект */
  private selectInput!: HTMLSelectElement;
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

    /** Очищаем прошлый рендер */
    this.shadow.innerHTML = "";

    /** Добавляем общие стили вопросов */
    this.shadow.appendChild(this.styleQuestionElement());
    /** Добавляем стили для dropdown */
    this.shadow.appendChild(this.styleElement());

    /** Корневой контейнер вопроса */
    const container = this.createContainer();

    /** Заголовок + описание */
    const header = this.createHeader();

    container.appendChild(header);

    /** Форма с селектом */
    const form = this.createForm();

    this.selectInput = this.createSelect();
    form.appendChild(this.selectInput);
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

    /** Навешиваем события */
    this.initEvents();
  }

  /**
   * Создаёт <select> с опциями из данных
   */
  private createSelect(): HTMLSelectElement {
    const sel = document.createElement("select");

    sel.className = "question-select";
    sel.required = !!this.data?.required;

    // Пустой пункт для выбора по умолчанию
    const placeholder = document.createElement("option");

    placeholder.value = "";
    placeholder.textContent = "— выберите —";
    placeholder.disabled = !!this.data?.required;
    placeholder.selected = true;
    sel.appendChild(placeholder);

    // Собираем опции
    this.data?.options?.forEach(opt => {
      const o = document.createElement("option");

      o.value = opt;
      o.textContent = opt;
      sel.appendChild(o);
    });

    return sel;
  }

  /**
   * Навешивает слушатели на select и кнопки
   */
  private initEvents(): void {
    /** Активируем кнопку при выборе опции */
    this.selectInput.addEventListener("change", () => {
      this.sendButton.disabled = !this.selectInput.value;
    });

    /** Обработка клика «Ответить» */
    this.sendButton.addEventListener("click", e => {
      e.preventDefault();
      const val = this.selectInput.value;

      if (!val) return;

      const answer: TAnswer = {
        question_id: this.data!.id!,
        value: val,
      };

      this.sendAnswer(answer);
    });
  }

  /**
   * Стили для DropdownQuestion (дополняют базовые)
   */
  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    style.textContent = `
      .question-select {
        width: 100%;
        max-width: 400px;
        padding: 8px 12px;
        font-size: var(--${OWNER}-font-size-description);
        border: 1px solid var(--${OWNER}-btn-bg-color);
        border-radius: 6px;
        background: #fff;
        color: var(--${OWNER}-text-color);
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888888'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 10px 6px;
        cursor: pointer;
      }

      .question-select:focus {
        outline: none;
        box-shadow: 0 0 0 1px var(--${OWNER}-btn-bg-color);
      }
    `;

    return style;
  }
}
