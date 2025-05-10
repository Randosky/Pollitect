import { setCookie } from "@services/CookieService";
import { SERVER_URL } from "@widget/vars";

import type { TCompletionScreen } from "@/widget/Survey.types";

import Screen, { type TScreenExternalData } from "../index";

type TCompletionScreenData = TScreenExternalData<TCompletionScreen>;

export default class CompletionScreen extends Screen {
  private externalData?: TCompletionScreenData;
  private finishBtn?: HTMLButtonElement;

  constructor() {
    super();
  }

  set data(newVal: TCompletionScreenData) {
    this.externalData = newVal;
  }

  get data(): TCompletionScreenData | undefined {
    return this.externalData;
  }

  connectedCallback() {
    this.render();
  }

  render(): void {
    if (!this.data) return;

    const { title, description, button_text, design_settings } = this.data.screen;

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

    this.finishBtn.addEventListener("click", async () => {
      try {
        await fetch(`${SERVER_URL}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            surveyId: this.data?.surveyData.id,
            sessionId: this.store?.getStateByKey("sessionId"),
          }),
        });

        /** Возвращаем скролл */
        document.body.style.removeProperty("overflow");

        /** Устанавливаем куки о прохождении */
        setCookie(`survey_${this.data?.surveyData?.id}_completed`, "true", {
          maxAge: Infinity,
          domain: window.location.origin,
        });

        /** Меняем текст кнопки */
        this.finishBtn!.onclick = null;
        this.finishBtn!.disabled = true;
        this.finishBtn!.textContent = "Ответы сохранены!";
      } catch (error) {
        /** Меняем текст кнопки */
        this.finishBtn!.onclick = null;
        this.finishBtn!.disabled = true;
        this.finishBtn!.textContent = "Что-то пошло не так";

        console.error(error);
      }
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
