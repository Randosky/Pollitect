/* eslint-disable camelcase */
import Question from "..";
import { OWNER } from "@widget/vars";

export default class SingleQuestion extends Question {
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

    const opts = document.createElement("div");

    opts.className = "options";
    this.data.options?.forEach(opt => {
      const label = document.createElement("label");

      label.className = "option-label";
      const r = document.createElement("input");

      r.type = "radio";
      r.name = `q-${this.data!.id}`;
      r.value = opt;
      label.append(r, document.createTextNode(" " + opt));
      opts.appendChild(label);
    });
    container.appendChild(opts);

    const btn = this.createButton("Next");

    btn.onclick = () => {
      const sel = opts.querySelector<HTMLInputElement>(`input[name="q-${this.data!.id}"]:checked`);

      this.handleAnswer(sel?.value ?? "");
    };
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
        .options { display:flex;flex-direction:column;gap:8px; }
        .option-label { font-size:14px; }
        .survey-button { margin-top:16px; }
      `;

    return s;
  }
}
