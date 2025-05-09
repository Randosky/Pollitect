import { OWNER } from "@widget/vars";

import type { TPersonalScreen } from "@/widget/Survey.types";

import Screen from "../index";

export default class PersonalScreen extends Screen {
  private externalData?: TPersonalScreen;

  constructor() {
    super();
  }

  set data(newVal: TPersonalScreen) {
    this.externalData = newVal;
  }

  get data(): TPersonalScreen | undefined {
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

    // Заголовок
    const title = document.createElement("h2");

    title.textContent = this.data.title ?? "О вас";
    container.appendChild(title);

    // Описание
    if (this.data.description) {
      const desc = document.createElement("p");

      desc.textContent = this.data.description;
      container.appendChild(desc);
    }

    // Форма полей
    const form = document.createElement("form");

    form.className = "personal-form";

    this.data.personal_fields?.forEach(field => {
      const label = document.createElement("label");

      label.textContent = field.label;

      const input = document.createElement("input");

      input.type = "text";
      input.placeholder = field.placeholder;
      input.required = field.required;

      label.appendChild(input);
      form.appendChild(label);
    });

    // Кнопка отправки
    const submit = document.createElement("button");

    submit.type = "submit";
    submit.textContent = this.data.button_text;
    submit.className = "survey-button";
    form.appendChild(submit);

    form.addEventListener("submit", e => {
      e.preventDefault();
      this.onNext?.();
    });

    container.appendChild(form);
    this.shadow.appendChild(container);
  }

  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    style.textContent = `
      .survey-screen {
        padding: 32px;
        background-color: var(--${OWNER}-bg-color);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      h2 {
        margin: 0;
        font-size: 20px;
      }
      p {
        font-size: 16px;
        color: var(--survey-text-color);
      }
      .personal-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      label {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        gap: 4px;
      }
      input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
      .survey-button {
        margin-top: 16px;
        background-color: var(--${OWNER}-btn-bg-color);
        color: white;
        padding: 10px 24px;
        font-size: 16px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        align-self: center;
      }
    `;

    return style;
  }
}
