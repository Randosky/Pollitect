/* eslint-disable camelcase */
import type { ISurvey } from "./Survey.types";

export class SurveyElement extends HTMLElement {
  private shadow: ShadowRoot;
  private surveyData!: ISurvey;
  private currentIndex = -1;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    if (this.surveyData) {
      this.render();
    }
  }

  public initialize(data: ISurvey): void {
    this.surveyData = data;

    if (this.isConnected) {
      this.render();
    }
  }

  private render(): void {
    const { design_settings } = this.surveyData;

    this.shadow.innerHTML = `
      <style>
        :host {
          font-family: ${design_settings.font_family}, sans-serif;
          color: ${design_settings.text_color};
          background: ${design_settings.background_color};
          border-radius: ${design_settings.borderRadius.map(px => px + "px").join(" ")};
          padding: ${design_settings.padding.map(px => px + "px").join(" ")};
          display: block;
          box-sizing: border-box;
          width: ${design_settings.width}${design_settings.width_unit};
          height: ${design_settings.height}${design_settings.height_unit};
        }
        .screen {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fade-in 0.3s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button {
          background: ${design_settings.button_color};
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          cursor: pointer;
          font-weight: bold;
        }
        .question-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        input, textarea {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
      </style>
      <div class="screen"></div>
    `;

    this.next();
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private next(): void {
    // Вставь сюда логику показа welcome/question/personal/completion экрана
    // из твоего метода next() без изменений — кроме использования this.shadow
    const container = this.shadow.querySelector(".screen")!;

    container.innerHTML = "";

    this.currentIndex++;

    if (this.currentIndex === 0 && this.surveyData.welcomeScreen.active) {
      const { title, description, button_text } = this.surveyData.welcomeScreen;
      const div = document.createElement("div");

      div.innerHTML = `<h1>${title || "Welcome!"}</h1><p>${description || ""}</p>`;
      const btn = document.createElement("button");

      btn.textContent = button_text;
      btn.onclick = () => this.next();
      div.appendChild(btn);
      container.appendChild(div);

      return;
    }

    const questions = this.surveyData.questions;

    if (this.currentIndex - 1 < questions.length) {
      const q = questions[this.currentIndex - 1];
      const qBlock = document.createElement("div");
      const title = document.createElement("h2");

      title.textContent = q.title;
      qBlock.appendChild(title);

      if (q.description) {
        const desc = document.createElement("p");

        desc.textContent = q.description;
        qBlock.appendChild(desc);
      }
      const answerBlock = document.createElement("div");

      answerBlock.className = "question-options";

      if (["single", "dropdown"].includes(q.type)) {
        q.options?.forEach(opt => {
          const label = document.createElement("label");
          const input = document.createElement("input");

          input.type = "radio";
          input.name = `question-${q.id}`;
          input.value = opt;
          label.appendChild(input);
          label.appendChild(document.createTextNode(" " + opt));
          answerBlock.appendChild(label);
        });
      } else if (q.type === "multi") {
        q.options?.forEach(opt => {
          const label = document.createElement("label");
          const input = document.createElement("input");

          input.type = "checkbox";
          input.value = opt;
          label.appendChild(input);
          label.appendChild(document.createTextNode(" " + opt));
          answerBlock.appendChild(label);
        });
      } else if (q.type === "text" || q.type === "date") {
        const input = document.createElement("input");

        input.type = q.type === "date" ? "date" : "text";
        answerBlock.appendChild(input);
      } else if (q.type === "textarea") {
        const textarea = document.createElement("textarea");

        answerBlock.appendChild(textarea);
      } else if (q.type === "binary") {
        ["Yes", "No"].forEach(opt => {
          const label = document.createElement("label");
          const input = document.createElement("input");

          input.type = "radio";
          input.name = `question-${q.id}`;
          input.value = opt;
          label.appendChild(input);
          label.appendChild(document.createTextNode(" " + opt));
          answerBlock.appendChild(label);
        });
      }

      const btn = document.createElement("button");

      btn.textContent = "Next";
      btn.onclick = () => this.next();

      qBlock.appendChild(answerBlock);
      qBlock.appendChild(btn);
      container.appendChild(qBlock);

      return;
    }

    if (this.currentIndex - 1 === questions.length && this.surveyData.personalScreen.active) {
      const personal = this.surveyData.personalScreen;
      const form = document.createElement("form");

      form.className = "question-options";
      const title = document.createElement("h2");

      title.textContent = personal.title || "About you";
      form.appendChild(title);

      if (personal.description) {
        const desc = document.createElement("p");

        desc.textContent = personal.description;
        form.appendChild(desc);
      }

      personal.personal_fields?.forEach(field => {
        const label = document.createElement("label");

        label.textContent = field.label;
        const input = document.createElement("input");

        input.placeholder = field.placeholder;
        input.required = field.required;
        input.type = "text";
        form.appendChild(label);
        form.appendChild(input);
      });

      const btn = document.createElement("button");

      btn.type = "submit";
      btn.textContent = personal.button_text;
      form.appendChild(btn);

      form.onsubmit = e => {
        e.preventDefault();
        this.next();
      };

      container.appendChild(form);

      return;
    }

    if (this.surveyData.completionScreen.active) {
      const comp = this.surveyData.completionScreen;
      const div = document.createElement("div");
      const title = document.createElement("h2");

      title.textContent = comp.title || "Thank you!";
      div.appendChild(title);
      const desc = document.createElement("p");

      desc.textContent = comp.description || "Your answers have been submitted.";
      div.appendChild(desc);

      if (comp.button_text && comp.button_url) {
        const a = document.createElement("a");

        a.href = comp.button_url;
        a.textContent = comp.button_text;
        a.target = "_blank";
        a.style.display = "inline-block";
        a.style.marginTop = "12px";
        a.style.color = "white";
        a.style.background = this.surveyData.design_settings.button_color;
        a.style.padding = "10px 16px";
        a.style.borderRadius = "8px";
        a.style.textDecoration = "none";
        div.appendChild(a);
      }

      container.appendChild(div);

      return;
    }

    container.innerHTML = "<p>Survey completed.</p>";
  }
}
