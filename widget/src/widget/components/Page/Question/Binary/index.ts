/* eslint-disable camelcase */
import Question from "..";
import { OWNER } from "@widget/vars";

/**
 * Вопрос «Да/Нет».
 */
export default class BinaryQuestion extends Question {
  constructor() {
    super();
  }

  connectedCallback() {
    if (this.externalData) this.render();
  }

  protected render(): void {
    if (!this.externalData) return;

    // очищаем прошлый рендер
    this.shadow.innerHTML = "";

    // вставляем стили
    this.shadow.appendChild(this.styleElement());

    // создаём контейнер
    const container = this.createContainer();

    // заголовок
    const title = document.createElement("h2");

    title.textContent = this.externalData.title;
    container.appendChild(title);

    // описание, если есть
    if (this.externalData.description) {
      const desc = document.createElement("p");

      desc.textContent = this.externalData.description;
      desc.className = "description";
      container.appendChild(desc);
    }

    // варианты
    const opts = document.createElement("div");

    opts.className = "options";

    const yesBtn = this.createButton("Yes");

    yesBtn.onclick = () => this.handleAnswer(true);
    opts.appendChild(yesBtn);

    const noBtn = this.createButton("No");

    noBtn.onclick = () => this.handleAnswer(false);
    opts.appendChild(noBtn);

    container.appendChild(opts);
    this.shadow.appendChild(container);
  }

  /** Отправляем CustomEvent и вызываем onNext */
  private handleAnswer(value: boolean): void {
    const detail = { question_id: this.externalData!.id, value };

    this.dispatchEvent(new CustomEvent("answer", { detail, bubbles: true, composed: true }));

    this.onNext?.();
  }

  /** Локальные стили */
  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    style.textContent = `
      .question-container {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        background-color: var(--${OWNER}-bg-color);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      h2 {
        margin: 0;
        font-size: 20px;
        color: var(--${OWNER}-text-color);
      }
      .description {
        margin: 0;
        font-size: 14px;
        color: var(--${OWNER}-text-color);
      }
      .options {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      .survey-button {
        flex: 1;
        padding: 10px 0;
        font-size: 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        background-color: var(--${OWNER}-btn-bg-color);
        color: #fff;
        transition: filter 0.2s;
      }
      .survey-button:hover {
        filter: brightness(0.9);
      }
    `;

    return style;
  }
}
