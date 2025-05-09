import { setCookie } from "@services/CookieService";

import type { TCompletionScreen } from "@/widget/Survey.types";

import Screen from "../index";

export default class CompletionScreen extends Screen {
  private externalData?: TCompletionScreen;
  private finishBtn?: HTMLButtonElement;

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

    const { title, description, button_text, design_settings } = this.data;

    /** Сброс перед рендером */
    this.shadow.innerHTML = "";

    /** Базовые стили экрана */
    this.shadow.appendChild(this.styleScreenElement(design_settings));
    /** Стили для completionScreen */
    this.shadow.appendChild(this.styleElement());

    /** Корневой контейнер экрана */
    const container = this.createScreenContainer();

    /** Картинка (если указано) */
    const imageEl = this.createImage(design_settings.image_url);

    if (imageEl) {
      container.appendChild(imageEl);
    }

    /** Блок контента с дополнительным классом */
    const contentEl = this.createContent();

    contentEl.classList.add("completion-content");

    /** Хедер */
    const header = this.createHeader();
    const titleEl = this.createTitle(title);
    const descEl = this.createDescription(description);

    if (titleEl) header.appendChild(titleEl);

    if (descEl) header.appendChild(descEl);
    contentEl.appendChild(header);

    /** Кнопка завершения, если есть */
    if (button_text) {
      this.finishBtn = document.createElement("button");

      this.finishBtn.className = "screen-button";
      this.finishBtn.textContent = button_text;
      contentEl.appendChild(this.finishBtn);
    }

    container.appendChild(contentEl);

    this.initEvents();

    this.shadow.appendChild(container);
  }

  private initEvents(): void {
    if (!this.finishBtn) return;

    this.finishBtn.addEventListener("click", () => {
      /** Возвращаем скролл */
      document.body.style.removeProperty("overflow");

      /** Устанавливаем куки о прохождении */
      setCookie(`survey_${this.surveyId}_completed`, "true", { maxAge: Infinity, domain: window.location.origin });

      /** Меняем текст кнопки */
      this.finishBtn!.onclick = null;
      this.finishBtn!.disabled = true;
      this.finishBtn!.textContent = "Ответы сохранены!";
    });
  }

  /** Собственные стили для CompletionScreen */
  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    style.textContent = `
      .completion-content {
        justify-content: center;
      }
    `;

    return style;
  }
}
