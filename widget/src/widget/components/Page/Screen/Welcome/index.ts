import type { TWelcomeScreen } from "@/widget/Survey.types";

import Screen from "../index";

export default class WelcomeScreen extends Screen {
  private externalData?: TWelcomeScreen;

  constructor() {
    super();
  }

  set data(newVal: TWelcomeScreen) {
    this.externalData = newVal;
  }

  get data(): TWelcomeScreen | undefined {
    return this.externalData;
  }

  connectedCallback() {
    this.render();
  }

  render(): void {
    if (!this.data) return;

    this.shadow.innerHTML = "";

    /** Стили */
    const style = this.styleElement();

    this.shadow.appendChild(style);

    const container = document.createElement("div");

    container.className = "survey-screen";

    const title = document.createElement("h1");
    const desc = document.createElement("p");

    title.textContent = this.data.title ?? "Добро пожаловать!";
    desc.textContent = this.data.description ?? "";

    const button = document.createElement("button");

    button.textContent = this.data.button_text;
    button.onclick = () => this.onNext?.();
    button.className = "survey-button";

    container.append(title, desc, button);

    this.shadow.innerHTML = "";
    this.shadow.append(container);
  }

  styleElement() {
    const styleElement = document.createElement("style");

    styleElement.textContent += `
      .survey-screen {
        padding: 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        background-color: var(--survey-bg-color);
        border-radius: 16px;
      }

      h1 {
        margin: 0;
        font-size: 24px;
      }

      p {
        font-size: 16px;
        color: var(--survey-text-color);
      }

      .survey-button {
        background-color: var(--survey-btn-color);
        color: white;
        padding: 10px 24px;
        font-size: 16px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
      }
    `;

    return styleElement;
  }
}
