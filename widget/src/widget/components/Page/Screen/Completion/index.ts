import type { TCompletionScreen } from "@/widget/Survey.types";

import Screen from "../index";
import { OWNER } from "@widget/vars";

export default class CompletionScreen extends Screen {
  private externalData?: TCompletionScreen;

  constructor() {
    super();
  }

  set data(newVal: TCompletionScreen) {
    this.externalData = newVal;
  }

  get data(): TCompletionScreen | undefined {
    return this.externalData;
  }

  connectedCallback() {
    this.render();
  }

  render(): void {
    if (!this.data) return;

    this.shadow.innerHTML = "";
    this.shadow.appendChild(this.styleElement());

    const container = document.createElement("div");

    container.className = "survey-screen";

    // Заголовок и описание
    const title = document.createElement("h2");

    title.textContent = this.data.title ?? "Спасибо!";
    container.appendChild(title);

    const desc = document.createElement("p");

    desc.textContent = this.data.description ?? "Ваши ответы отправлены.";
    container.appendChild(desc);

    // Кнопка-ссылка, если есть
    if (this.data.button_text && this.data.button_url) {
      const link = document.createElement("a");

      link.textContent = this.data.button_text;
      link.href = this.data.button_url;
      link.target = "_blank";
      link.className = "survey-button";
      container.appendChild(link);
    }

    this.shadow.appendChild(container);
  }

  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    style.textContent = `
      .survey-screen {
        padding: 32px;
        background-color: var(--${OWNER}-bg-color);
        border-radius: 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
      }
      h2 {
        margin: 0;
        font-size: 22px;
      }
      p {
        font-size: 16px;
        color: var(--survey-text-color);
      }
      .survey-button {
        margin-top: 20px;
        background-color: var(--${OWNER}-btn-color);
        color: white;
        padding: 10px 24px;
        font-size: 16px;
        border-radius: 8px;
        text-decoration: none;
      }
    `;

    return style;
  }
}
