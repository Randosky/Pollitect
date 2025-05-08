/* eslint-disable camelcase */
import Question from "..";
import { OWNER } from "@widget/vars";

export default class TextQuestion extends Question {
  constructor() {
    super();
  }

  connectedCallback() {
    if (this.data) this.render();
  }

  protected render(): void {
    if (!this.data) return;
    this.shadow.innerHTML = "";
    this.shadow.appendChild(this.styleElement());

    const container = this.createContainer();
    const title = document.createElement("h2");

    title.textContent = this.data.title;
    container.appendChild(title);

    if (this.data.description) {
      const desc = document.createElement("p");

      desc.textContent = this.data.description;
      desc.className = "description";
      container.appendChild(desc);
    }

    const input = document.createElement("input");

    input.type = "text";
    input.className = "survey-input";
    container.appendChild(input);

    const btn = this.createButton("Next");

    btn.onclick = () => this.handleAnswer(input.value);
    container.appendChild(btn);

    this.shadow.appendChild(container);
  }

  private handleAnswer(value: string): void {
    this.dispatchEvent(
      new CustomEvent("answer", {
        detail: { question_id: this.data!.id, value },
        bubbles: true,
        composed: true,
      })
    );
    this.onNext?.();
  }

  private styleElement(): HTMLStyleElement {
    const s = document.createElement("style");

    s.textContent = `
        .question-container { padding:24px; }
        h2,p{margin:0;color:var(--${OWNER}-text-color)} .description{font-size:14px;}
        .survey-input {
          padding:8px; border:1px solid #ccc; border-radius:6px;
        }
        .survey-button { margin-top:16px; }
      `;

    return s;
  }
}
