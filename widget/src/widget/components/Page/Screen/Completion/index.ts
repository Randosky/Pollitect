import type { TCompletionScreen } from "@/widget/Survey.types";

import Screen from "../index";

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

    const { title, description, button_text, button_url, design_settings } = this.data;

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

    /** Кнопка-ссылка, если есть */
    if (button_text && button_url) {
      const link = document.createElement("a");

      link.className = "screen-button";
      link.textContent = button_text;
      link.href = button_url;
      link.target = "_blank";
      contentEl.appendChild(link);
    }

    container.appendChild(contentEl);
    this.shadow.appendChild(container);
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
