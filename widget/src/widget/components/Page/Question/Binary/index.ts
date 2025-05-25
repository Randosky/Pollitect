import Question from "@components/Page/Question";

/**
 * Вопрос «Да/Нет».
 */
export default class BinaryQuestion extends Question {
  /** Контейнер с опциями */
  private optionsContainer!: HTMLDivElement;
  /** Кнопка отправки */
  private sendButton!: HTMLButtonElement;
  /** Кнопка пропуска */
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

    /** Подключаем общие стили вопросов */
    this.shadow.appendChild(this.styleQuestionElement());
    this.shadow.appendChild(this.styleElement());

    /** Создаём корневой контейнер */
    const container = this.createContainer();

    /** Хедер с заголовком и описанием */
    const header = this.createHeader();

    /** Форма с опциями и кнопками */
    const form = this.createForm();

    this.optionsContainer = this.createOptions();

    /** Кнопки */
    const buttonContainer = this.createButtonContainer();

    if (!this.data.question.required) {
      this.skipButton = this.createSkipButton();
      buttonContainer.appendChild(this.skipButton);
    }

    this.sendButton = this.createSendButton();
    this.sendButton.disabled = true;
    buttonContainer.appendChild(this.sendButton);

    form.append(this.optionsContainer);

    container.appendChild(header);
    container.appendChild(form);
    container.appendChild(buttonContainer);

    /** Инициализируем слушатели событий */
    this.initEvents();

    this.shadow.appendChild(container);
  }

  /**
   * Создаёт контейнер с опциями «Да»/«Нет»
   */
  private createOptions(): HTMLDivElement {
    const opts = document.createElement("div");

    opts.className = "question-options";

    ["Да", "Нет"].forEach((label, idx) => {
      const id = `bin-${this.data!.question.id}-${idx}`;
      const wrapper = document.createElement("label");

      wrapper.className = "question-option";
      wrapper.htmlFor = id;

      const input = document.createElement("input");

      input.type = "radio";
      input.name = `bin-${this.data!.question.id}`;
      input.id = id;
      input.value = idx === 0 ? "true" : "false";

      const fake = document.createElement("span");

      fake.className = "fake";

      const text = document.createElement("span");

      text.className = "text";
      text.textContent = label;

      wrapper.append(input, fake, text);
      opts.append(wrapper);
    });

    return opts;
  }

  /**
   * Инициализирует обработчики событий для формы и опций
   */
  private initEvents(): void {
    /** при выборе опции — активируем кнопку «Ответить» */
    this.optionsContainer.addEventListener("change", () => {
      this.sendButton.disabled = false;
    });

    /** при сабмите формы — отправляем событие и вызываем onNext */
    this.sendButton.addEventListener("click", e => {
      e.preventDefault();

      const checked = this.optionsContainer.querySelector('input[type="radio"]:checked') as HTMLInputElement | null;

      if (!checked) return;

      this.sendAnswer({ question_id: this.data!.question.id!, value: checked.checked });
    });
  }

  /**
   * Расширяем базовые стили вопросов стилями для опций и контента
   */
  protected styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    const owner = this.store?.getStateByKey("owner");

    style.textContent += `
      .question-options {
        width: 100%;
        display: grid;
        row-gap: 24px;
        column-gap: 32px;
        overflow-x: auto;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        grid-template-rows: repeat(4, auto);
      }

      .question-option {
        width: fit-content;
        gap: 8px;
        cursor: pointer;
        align-items: center;
        display: inline-flex;
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
        border: 2px solid var(--${owner}-btn-bg-color);
        border-radius: 50%;
        position: relative;
        transition: border-color 0.2s;
      }

      .question-option .fake:after {
        content: "";
        position: absolute;
        inset: 4px;
        border-radius: 50%;
        background: var(--${owner}-btn-bg-color);
        transform: scale(0);
        transition: transform 0.2s;
      }

      .question-option input:checked + .fake:after {
        transform: scale(1);
      }

      .question-option .text {
        font-size: var(--${owner}-font-size-button);
        line-height: 140%;
      }
    `;

    return style;
  }
}
